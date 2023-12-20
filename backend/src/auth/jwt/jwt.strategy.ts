import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from './payload.interface';
import {UsersService} from "../../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userService: UsersService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		// PATHS TO LIFT RESTRICTIONS
		if (request.url.startsWith('/auth') && !(request.url === '/auth/loginStatus'
		|| request.url === '/auth/verify' || request.url.startsWith('/auth/2fa/') || request.url.startsWith('/auth/logout') || request.url.startsWith('/users/remove')))
		return true;

		if (request.url.startsWith('/users/remove'))
			return true;

		if (request.url.startsWith('/users/me/users'))
			return true;
		// VALIDATE TOKEN AND CHECK IF USER EXISTS
		const token = this.extractTokenFromHeader(request);
		request['user'] = await this.validateToken(token);
		if (!request['user']
			|| !await this.userService.findOneByID(request['user']['id'])) {
			throw new UnauthorizedException('Invalid token');
		}

		return true;
	}

	async validateToken(token: string): Promise<AuthPayload> {
		if (!token) {
			return undefined;
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token, { secret: process.env.JWT_SECRET }
			);
			return payload;
		} catch {
			return undefined;
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
