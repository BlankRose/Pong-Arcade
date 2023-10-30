import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import * as bcrypt from 'bcrypt';
import { Login42Dto } from './dto/login42.dto';
import { Api42Service } from '../API42/api42.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private api42Service: Api42Service,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async login(req: LoginDto) {
		const user = await this.validateUser(req.username, req.password);
		if (!user) {
			throw new UnauthorizedException();
		}

		const payload = { username: user.username, id: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async login42(login42Dto: Login42Dto) {
  		const data = await this.api42Service.getUserData(login42Dto.code);
		const user = await this.usersService.findOne42(data.id);

		if (user) {
			const payload = { username: user.username, id: user.id };
			return {
				access_token: this.jwtService.sign(payload),
			};
		}
		throw new UnauthorizedException();
	}

	async register(registerDto: RegisterDto): Promise<any> {
		await this.usersService.createUser({
			username: registerDto.username,
			password: registerDto.password,
		});
	}

	async register42(registerDto: Register42Dto): Promise<any> {
		const data = await this.api42Service.getUserData(registerDto.code);
		await this.usersService.createUserFrom42({
			username: registerDto.username,
			code: data.id
		});
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
}
