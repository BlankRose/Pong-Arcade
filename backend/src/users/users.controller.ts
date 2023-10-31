import { Controller, Post, Get, Body, UseGuards, Request, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';
import { AuthGuard } from 'src/auth/jwt/jwt.strategy';
import { use } from 'passport';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('block')
	blockUser(@Body() blockUserDto: BlockUserDto) {
		return this.usersService.blockUser(blockUserDto.userId, blockUserDto.blockedUserId);
	}

	// @UseGuards(AuthGuard)
	@UseGuards(AuthGuard)
	@Get('me')
	async getUserInfo (@Request() req) {
		try {
			await this.usersService.getUserInfo(req.user['username'])
		} catch (error) {
			throw new NotFoundException
		}
	}


}

   
