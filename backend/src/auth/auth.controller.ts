import { Controller, Post, Get, Request, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { Login42Dto } from './dto/login42.dto';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	async login(@Request() req, @Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('/login42')
	async login42(@Body() login42Dto: Login42Dto) {
		return this.authService.login42(login42Dto);
	}

	@Post('/register')
	async register(@Body() registerDto: RegisterDto) {
		try {
			return await this.authService.register(registerDto);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw new ConflictException('Le nom d\'utilisateur existe déjà.');
			}
			throw error;
		}
	}

	@Post('/register42')
	async register42(@Body() register42Dto: Register42Dto) {
		try {
			return await this.authService.register42(register42Dto);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw new ConflictException('Le nom d\'utilisateur existe déjà.');
			}
			throw error;
		}
	}

	@Get('/token42')
	async token42(@Request() req) {
		return this.authService.token42(req.query.code, req.query.uri);
	}
}
