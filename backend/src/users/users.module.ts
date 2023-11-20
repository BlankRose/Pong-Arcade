// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Game } from 'src/game/entities/game.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Game])
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController]
})

export class UsersModule {}
