import { Controller, Post, Get, Body, Request, Param, Patch, NotFoundException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	async getProfile(@Request() req) {
		const user = await this.usersService.findOneByID(req.user['id']);
		return this.usersService.purgeData(user);
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
		return this.usersService.replaceUsername(req.user['id'], body.username);
	}

	@Post('me/avatar')
	changeAvatar(@Body() body: UploadAvatarDto, @Request() req)
	{
		return this.usersService.replaceAvatar(req.user['id'], body)
	}

	@Post('remove')
	removeUSer(@Body() body) {
		return this.usersService.removeUser(body.id);
	}

	@Delete('me/avatar')
	removeAvatar(@Request() req)
	{
		return this.usersService.removeAvatar(req.user['id']);
	}


}

   
