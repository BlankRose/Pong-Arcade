import { Controller, Post, Get, Body, UseGuards, Request, Put, Param, Patch, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';
import { User } from './user.entity';
import { NotFoundError } from 'rxjs';

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
	async getProfile(@Request() req) {
		return this.usersService.purgeData(
			await this.usersService.findOneByID(req.user['id'])
		);
	}

	@Get(':username')
	async findOne(@Param() params): Promise<User> {
		const user = await this.usersService.findOne(params.username);

		if (!user)
			throw new NotFoundException;
		return this.usersService.purgeData(user);
	}

	@Patch('me')
	changeName(@Body() body, @Request() req)
	{
		console.log(req.user);
		return this.usersService.replaceUsername(req.user['id'], body.username);
	}
}
