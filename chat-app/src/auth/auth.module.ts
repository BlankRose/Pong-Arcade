// src/auth/auth.module.ts
import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local.strategy'; 

@Module({
  imports: [
    UsersModule,  // Ajoutez cette ligne pour importer UsersModule
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // Utilisez une clé secrète plus complexe
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}