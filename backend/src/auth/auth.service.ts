import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import * as bcrypt from 'bcrypt';
import { Login42Dto } from './dto/login42.dto';
import { Api42Service } from '../API42/api42.service';
import { User } from 'src/users/user.entity';

import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import {Request, Body} from '@nestjs/common'
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './jwt/payload.interface';

@Injectable()
export class AuthService {
	constructor(
		private api42Service: Api42Service,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	generateNewJWT(user: User) {
		const payload = new AuthPayload(user);
		return {
			access_token: this.jwtService.sign(Object.assign({}, payload)),
		};
	}

	checkString(base: string): boolean {
		if (!base)
			return;
		const clean = base
			.replaceAll(' ', '').replaceAll('\t', '')
			.replace(/[^a-zA-Z0-9]/g, '');
		return clean == base;
	}

	async login(req: LoginDto) {
		if (!req.username || !req.password
			|| !req.username.length || !req.username.length
			|| req.username.length <= 0 || req.username.length <= 0)
			throw new BadRequestException("Missing credentials");

		const username = req.username.replaceAll(' ', '').replaceAll('\t', '');
		if (!this.checkString(username))
			throw new BadRequestException("Username must be alphanumeric");

		const user = await this.validateUser(username, req.password);
		if (!user) {
			throw new UnauthorizedException("Invalid user or password");
		}

		this.usersService.turnOnline(user.id);
		this.usersService.setIsNeed2FA(user.id);
		return this.generateNewJWT(user);
	}

	async login42(login42Dto: Login42Dto) {

  		const data = await this.api42Service.getUserData(login42Dto.code);
		const user = await this.usersService.findOne42(data.id);

		if (user) {
			const payload = { id: user.id };
			this.usersService.turnOnline(user.id)
			this.usersService.setIsNeed2FA(user.id)

			return this.generateNewJWT(user);
		}
		throw new UnauthorizedException("No user bound");
	}

	async register(req: RegisterDto): Promise<any> {
		if (!req.username || !req.password
			|| !req.username.length || !req.username.length
			|| req.username.length <= 0 || req.username.length <= 0)
			throw new BadRequestException("Missing credentials");

		const username = req.username.replaceAll(' ', '').replaceAll('\t', '');
		if (!this.checkString(username))
			throw new BadRequestException("Username must be alphanumeric");
		if (username.length > 40)
			throw new BadRequestException("Username must be less or equal to 40 characters");

		await this.usersService.createUser({
			username: username,
			password: req.password,
			status: 'online',
			is2FANeeded: false,
		});
	}

	async register42(registerDto: Register42Dto): Promise<any> {
		const data = await this.api42Service.getUserData(registerDto.code);

		
		const user = await this.usersService.createUserFrom42({
			username: registerDto.username,
			code: data.id,
			status: 'online',
			is2FANeeded: false,

		});
		return this.generateNewJWT(user);
	}

	async token42(code: string, uri: string): Promise<any> {
		return await this.api42Service.getUserToken(code, uri);
	}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findOne(username);
		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (isPasswordValid) {
				const { password, ...result } = user;
				return result;
			}
		}
		return null;
	}

		// ****************************2FA Part****************************

		async turnOn2fa(@Request() req, @Body() body) {
			const user = await this.usersService.findOneByID(req.user['id'])
			if(!user){
				throw new NotFoundException('User does not exist!')
			}
			
			const isCodeValid = this.is2FASecretValid(body.ProvidedCode, user)
			if (!isCodeValid) {
				throw new UnauthorizedException('Wrong Code')
			}
			this.usersService.turnOn2FA(user.id)
			return true
		}

		async turnOff2fa(@Request() req) {
			const user = await this.usersService.findOneByID(req.user['id'])
	
			if(!user){
				throw new NotFoundException('User does not exist!')
			}
			this.usersService.turnOff2FA(user.id)
			return true
	
		}

		async generate2FASecret(user: User){
			const secret: string = authenticator.generateSecret()
			const otpauthurl: string = authenticator.keyuri(user.username, 'Pong_Arcade', secret)
			await this.usersService.set2FASecret(secret, user.id)
			return{secret,otpauthurl}
		}
	
		async turnUrlToQrCode (otpauthurl: string){
			return toDataURL(otpauthurl)
		}
	
		async generateQrCode (@Request() req) {
			const user = await this.usersService.findOneByID(req.user['id']) 
			if (!user) {
				throw new NotFoundException('User does not exist!')
			}
			const secretUrl = await this.generate2FASecret(user)
			const qrCode = await this.turnUrlToQrCode(secretUrl.otpauthurl)
			return qrCode
		}
	
	
		is2FASecretValid (ProvidedCode: string, user: User):boolean {
			const L = authenticator.verify ({token: ProvidedCode, secret: user._2FAToken})
			return (L)
		}
	
		async codeVerification (@Request() req, @Body() body ) {
			const user = await this.usersService.findOneByID(req.user['id'])
			if(!user) {
				throw new NotFoundException('User does not exist')
			}
			const isCodeValid = this.is2FASecretValid(body.ProvidedCode, user)
			if (!isCodeValid){
				throw new UnauthorizedException('Wrong Code!')
			}
			this.usersService.toogleIsNeed2FA(user.id);
			return true
		}
}
