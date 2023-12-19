import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
	JWTSecret: process.env.JWT_SECRET
}));
