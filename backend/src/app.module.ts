// src/app.module.ts 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import databaseConfig from './config/database.config';
import { ChatModule } from './chat/chat.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: 'database',
				port: 5432,
				username: configService.get('database.user'),
				password: configService.get('database.password'),
				database: configService.get('database.database'),
				entities: ['dist/**/*.entity{.ts,.js}'],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'assets'),
			serveStaticOptions: { index: undefined },
			serveRoot: "/avatar",
		}),
		AuthModule,
		UsersModule,
		ChatModule,
		JwtModule
	],
	controllers: [AppController],
	providers: [AppService, {
		provide: APP_GUARD,
		useClass: AuthGuard
	}]
})

export class AppModule {}
