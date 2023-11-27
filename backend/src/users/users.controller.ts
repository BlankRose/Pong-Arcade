import { Controller, Post, Get, Body, Request, Param, Patch, NotFoundException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { Game } from 'src/game/entities/game.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	async getRawUser(target: string): Promise<User> {
		const id = parseInt(target);
		return Number.isNaN(id)
			? await this.usersService.findOne(target)
			: await this.usersService.findOneByID(id);
	}

	@Get('all')
	async getAllUsers() {
		let users = await this.usersService.getAllUsers();
		for (let i = 0; i < users.length; i++)
			users[i] = this.usersService.purgeData(users[i]);
		return users;
	}

	@Get('me')
	async getProfile(@Request() req) {
		const user = await this.usersService.findOneByID(req.user['id']);
		return this.usersService.purgeData(user);
	}

	@Get('me/history')
	async getHistory(@Request() req): Promise<Game[]> {
		const user = await this.usersService.findOneByID(req.user['id']);
		return this.usersService.getHistory(user);
	}

	@Get(':username')
	async findOne(@Param() params): Promise<User> {
		const user = await this.getRawUser(params.username);
		if (!user)
			throw new NotFoundException;
		return this.usersService.purgeData(user);
	}

	@Get(':username/history')
	async getUserHistory(@Param() params): Promise<Game[]> {
		const user = await this.getRawUser(params.username);
		if (!user)
			throw new NotFoundException;
		return this.usersService.getHistory(user);
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

	@Delete('me/avatar')
	removeAvatar(@Request() req)
	{
		return this.usersService.removeAvatar(req.user['id']);
	}


}

   
