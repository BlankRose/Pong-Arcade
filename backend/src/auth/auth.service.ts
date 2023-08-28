import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import * as bcrypt from 'bcrypt';
import { Login42Dto } from './dto/login42.dto';
import { Api42Service } from '../API42/api42.service';
import { User } from 'src/users/user.entity';

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

	async token42(code: string): Promise<any> {
		return await this.api42Service.getUserToken(code);
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
