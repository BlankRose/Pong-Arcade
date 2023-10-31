// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { User} from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async findOne(username: string): Promise<User | undefined> {
		return this.usersRepository.findOne({ where: { username: username } });
	}

	async findOneByID(id: number): Promise<User | undefined> {
		return this.usersRepository.findOne({where: {id: id}});
	}

	// Removes critical information of the User data
	// /!\ USE BEFORE SENDING USER AS REPLY
	purgeData(user: User): User {
		if (!user)
			return undefined;

		delete user.password;
		delete user.id42;
		delete user.token2FA;

		return user;
	}

	async findOne42(id42: number): Promise<User | undefined> {
		return this.usersRepository.findOne({ where: { id42: id42 } });
	}

	async createUser(data: any): Promise<User> {
		// Vérifiez si l'utilisateur existe déjà
		const existingUser = await this.usersRepository.findOne({ where: { username: data.username } });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash(data.password, 10);

		const savedUser = await this.usersRepository.save(user);
		return savedUser;
	}

	async createUserFrom42(data: any): Promise<User> {
		const existingUser = await this.usersRepository.findOne({ where: { username: data.username } });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash('', 10);

		user.id42 = data.code;
		const savedUser = await this.usersRepository.save(user);
		return savedUser;
	}

	async validateUserPassword(username: string, rawPassword: string): Promise<boolean> {
		const user = await this.usersRepository.findOne({ where: { username: username } });
		if (!user) {
				return false;
		}
		const isMatch = await bcrypt.compare(rawPassword, user.password);
		return isMatch;
	}

	async replaceUsername(target: number, newUserName: string): Promise<User>
	{
		if (!newUserName)
			throw new BadRequestException('Missing \'username\' parameter');
		const existingUser = await this.findOne(newUserName);

		if (!existingUser)
			await this.usersRepository.update(target, { username: newUserName });
		else if (existingUser.id !== target)
			throw new ConflictException('Username already exists');

		const updateUser = await this.findOneByID(target);
		return this.purgeData(updateUser);
	}

	async replaceAvatar(target: number, newAvatar: UploadAvatarDto): Promise<User>
	{
		if (!newAvatar || !newAvatar.data)
			throw new BadRequestException('Missing the avatar');

		await this.usersRepository.update(target, { avatar: newAvatar.data });
		return this.purgeData(await this.findOneByID(target));
	}

	async removeAvatar(target: number): Promise<User>
	{
		await this.usersRepository.update(target, { avatar: null });
		return this.purgeData(await this.findOneByID(target));
	}
}
