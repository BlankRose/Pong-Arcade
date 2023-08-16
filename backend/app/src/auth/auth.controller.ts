// src/auth/auth.controller.ts

import { Controller, Post, Request, Body, UseGuards, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; // Importez le nouveau DTO

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('/login')
	async login(@Request() req, @Body() loginDto: LoginDto) {
		return this.authService.login(req.user);
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
}
