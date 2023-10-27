import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';
import { AuthGuard } from 'src/auth/jwt/jwt.strategy';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('block')
	blockUser(@Body() blockUserDto: BlockUserDto) {
		return this.usersService.blockUser(blockUserDto.userId, blockUserDto.blockedUserId);
	}

	// @UseGuards(AuthGuard)
	@Get('me')
	getProfile(@Request() req) {
		return req.user;
	}
}
