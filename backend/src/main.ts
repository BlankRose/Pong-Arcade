import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function start() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors({
		allowedHeaders: 'Content-Type, Authorization',
		origin: '*',
		credentials: true,
	});

	app.useBodyParser('json', { limit: '1mb' });

	const port = 3001;
	await app.listen(port);
	Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}

start();
