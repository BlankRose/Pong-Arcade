import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB
}));
