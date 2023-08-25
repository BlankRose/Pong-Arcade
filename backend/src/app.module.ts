import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: 'database', // Use the service name
				port: 5432,
				username: configService.get('database.user'), // Use the retrieved configuration
				password: configService.get('database.password'), // Use the retrieved configuration
				database: configService.get('database.database'), // Use the retrieved configuration
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService]
})

export class AppModule {}
