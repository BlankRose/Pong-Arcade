import { Controller, Post, Get, Header, Request, Body, ConflictException, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { Login42Dto } from './dto/login42.dto';
import { RegisterDto } from './dto/register.dto';
import { Register42Dto } from './dto/register42.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService) {}

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

    @Get('/loginStatus')
    getStatus(@Request() req) {
        if (req ) {
		  return "online"
		}
		else
		  return "offline"
    }

	@Post('/logout')
	async logoutSession(@Request() req) {
			return await this.usersService.logout(req.user['id'])
	}

	/* -- AUTH GUARD ENFORCED BELOW -- */

	@Get('/verify')
	async verify() {
		// Would automatly get verified by AuthGuard
		return { status: 'ok' };
	}

    @Post('/2fa/turn-on')
    async turnOn2FA(@Request() req: any, @Body() body) {
        return await this.authService.turnOn2fa(req, body)
    }

    @Post('/2fa/turn-off')
    async turnOff2FA(@Request() req: any, @Body() body) {
        return await this.authService.turnOff2fa(req)
    }

    @Get('/2fa/generateQr')
    async generateQR(@Request() req: any) {
        return await this.authService.generateQrCode(req)
    }

    @Post('/2fa/authenticate')
    async codeVerification(@Request() req: any, @Body() body) {
        return await this.authService.codeVerification(req, body)
    }
}
