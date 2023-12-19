import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { FriendsService } from 'src/friends/friends.service';
import { Friend } from '../friends/friends.entity'
import { Channel } from '../chat/entities/channel.entity'
import {Game} from "../game/entities/game.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Friend, Channel, Game])
	],
	providers: [UsersService, FriendsService],
	exports: [UsersService],
	controllers: [UsersController]
})

export class UsersModule {}
