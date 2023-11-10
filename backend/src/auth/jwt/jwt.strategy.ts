import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from './payload.interface'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		if (request.url.startsWith('/auth') && !(request.url === '/auth/loginStatus'
			|| request.url === '/auth/verify' || request.url.startsWith('/auth/2fa') || request.url.startsWith('/auth/logout')))
			return true;

		const token = this.extractTokenFromHeader(request);
		request['user'] = await this.validateToken(token);

		if (!request['user']) {
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