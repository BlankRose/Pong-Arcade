// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
<<<<<<< HEAD

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Important si vous voulez utiliser ce service dans d'autres modules
=======
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController]
>>>>>>> master
})

export class UsersModule {}
