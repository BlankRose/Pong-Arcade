// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPayload(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const user = await this.usersService.createUser({
      username: registerDto.username,
      password: registerDto.password,
    });
    
    // Vous pouvez retourner ce que vous voulez après l'enregistrement
    // par exemple, vous pourriez immédiatement connecter l'utilisateur et lui retourner un token JWT
    return user;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}
