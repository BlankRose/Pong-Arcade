import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { Api42Module } from '../API42/api42.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local.strategy'; 

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
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})

export class AuthModule {}
