import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { Api42Module } from '../API42/api42.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import JwtConfig from '../config/jwt.config';

@Module({
	imports: [
		Api42Module,
		UsersModule,
		PassportModule,
		ConfigModule.forFeature(JwtConfig),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '60d' },
		}),
	],
	providers: [AuthService],
	exports: [AuthService],
	controllers: [AuthController],
})

export class AuthModule {}
