import { Controller, Post, Get, Body, UseGuards, Request, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/*
	@Post('block')
	blockUser(@Body() blockUserDto: BlockUserDto) {
		return this.usersService.blockUser(blockUserDto.userId, blockUserDto.blockedUserId);
	}
	*/
	@Get('me')
	getProfile(@Request() req) {
		return this.usersService.getUser(req.user['username']);
	}

	@Get(':username')
	findOne(@Param() params: any): Promise<User> {
		console.log(params.username);
		return this.usersService.getUser('username')
	}

	@Put(':me')
	changeName(@Request() req, @Body() body)
	{
		return this.usersService.replaceUsername(body.username, req.user['username']);
	}
}
