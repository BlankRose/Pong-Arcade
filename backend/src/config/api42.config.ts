import { registerAs } from '@nestjs/config';

export default registerAs('api42', () => ({
	clientId: process.env.API_UID,
	clientSecret: process.env.API_SECRET
}));
