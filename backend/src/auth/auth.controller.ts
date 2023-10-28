import { Controller, Post, Get, Request, Body, UseGuards, ConflictException } from '@nestjs/common';
import { AuthGuard } from './jwt/jwt.strategy';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { Login42Dto } from './dto/login42.dto';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import { log } from 'console';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	async login(@Request() req, @Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('/login42')
	async login42(@Request() req , @Body() login42Dto: Login42Dto) {
		return this.authService.login42(req, login42Dto);
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

	@UseGuards(AuthGuard)
    @Post('2fa/turn-on')
    async turnOn2FA(@Request() req: any, @Body() body) {
        return await this.authService.turnOn2fa(req, body)
    }

	@UseGuards(AuthGuard)
    @Post('2fa/turn-off')
    async turnOff2FA(@Request() req: any) {
        return await this.authService.turnOff2fa(req)
    }

	@UseGuards(AuthGuard)
    @Get('/2fa/generateQr')
    async generateQR(@Request() req: any) {
        return await this.authService.generateQrCode(req)
    }


	@UseGuards(AuthGuard)
    @Post('2fa/authenticate')
    async codeVerification(@Request() req: any, @Body() body) {
        return await this.authService.codeVerification(req, body)
    }
}
