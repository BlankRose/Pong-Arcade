import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		allowedHeaders: '*',
		origin: '*',
		credentials: true,
	}); // Activez CORS pour toutes les origines
	const port = 3001;
	await app.listen(port);
	Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
