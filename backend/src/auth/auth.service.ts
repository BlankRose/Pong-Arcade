import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import * as bcrypt from 'bcrypt';
import { Login42Dto } from './dto/login42.dto';
import { Api42Service } from '../API42/api42.service';
import { User } from 'src/users/user.entity';

import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode'

import * as QRCode from 'qrcode';
import {Request, Body} from '@nestjs/common'

@Injectable()
export class AuthService {
	constructor(
		private api42Service: Api42Service,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUserByPayload(payload: JwtPayload): Promise<any> {
		const user = await this.usersService.findOne(payload.username);
		if (user) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: User) {
		const payload = { username: user.username, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async login42(login42Dto: Login42Dto) {
  		const data = await this.api42Service.getUserData(login42Dto.code);
		const user = await this.usersService.findOne42(data.id);

		if (user) {
			const payload = { username: user.username, sub: user.id };
			return {
				access_token: this.jwtService.sign(payload),
			};
		}
		throw new UnauthorizedException();
	}

	async register(registerDto: RegisterDto): Promise<any> {
		const user = await this.usersService.createUser({
			username: registerDto.username,
			password: registerDto.password,
		});

		return user;
	}

	async register42(registerDto: Register42Dto): Promise<any> {
		const data = await this.api42Service.getUserData(registerDto.code);

		const user = await this.usersService.createUserFrom42({
			username: registerDto.username,
			code: data.id
		});
		return user;
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
		const user = await this.usersService.findOne(req.user.username)

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
		const user = await this.usersService.findOne(req.user.username)

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
		const user = await this.usersService.findOne(req.user.username) 
		if (!user) {
			throw new NotFoundException('User does not exist!')
		}
		const secretUrl = await this.generate2FASecret(user)
		const qrCode = await this.turnUrlToQrCode(secretUrl.otpauthurl)
		return qrCode
	}


	is2FASecretValid (ProvidedCode: string, user: User):boolean {
		return authenticator.verify ({token: ProvidedCode, secret: user._2FAToken})
	}


	async codeVerification (@Request() req, @Body() body ) {
		const user = await this.usersService.findOne(req.user.username)
		if(!user) {
			throw new NotFoundException('User does not exist')
		}
		const isCodeValid = this.is2FASecretValid(body.ProvidedCode, user)
		if (!isCodeValid){
			throw new UnauthorizedException('Wrong Code!')
		}
        return true
	}
	// ****************************2Fa Part****************************
}
