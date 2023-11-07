import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

class AuthPayload {
	id: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		if (request.url.startsWith('/auth') && !(request.url === '/auth/loginStatus'
			|| request.url === '/auth/verify' || request.url.startsWith('/auth/2fa')))
			return true;

		const token = this.extractTokenFromHeader(request);
		request['user'] = await this.validateToken(token);

		return true;
	}

	async validateToken(token: string): Promise<AuthPayload> {
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token, { secret: process.env.JWT_SECRET }
			);
			return payload;
		} catch {
			throw new UnauthorizedException();
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
