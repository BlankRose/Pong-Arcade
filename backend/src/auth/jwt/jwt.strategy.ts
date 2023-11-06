import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		if (request.url.startsWith('/auth') && !(request.url === '/auth/loginStatus'
			|| request.url === '/auth/verify' || request.url.startsWith('/auth/2fa/') || request.url.startsWith('/auth/logout') || request.url.startsWith('/users/remove')))
			return true;
		   


		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token, { secret: process.env.JWT_SECRET }
			);
			request['user'] = payload;
			// request['needs2FA'] = true;
		} catch {
			throw new UnauthorizedException();
		}
		
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
