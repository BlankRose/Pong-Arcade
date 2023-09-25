// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async findOne(username: string): Promise<User | undefined> {
		return this.usersRepository.findOne({ where: { username } });
	}

	async createUser(data: any): Promise<User> {
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
		const user = await this.usersRepository.findOne({ where: { username } });
		if (!user) {
				return false;
		}
		const isMatch = await bcrypt.compare(rawPassword, user.password);
		return isMatch;
	}

	async blockUser(userId: number, blockedUserId: number): Promise<void> {
		const user = await this.usersRepository.findOne({ where: { id: userId } });
		const blockedUser = await this.usersRepository.findOne({ where: { id: blockedUserId } });
		
		if (!user || !blockedUser) {
			throw new NotFoundException('User not found');
		}
	
		// Charger la relation blockedUsers si elle n'est pas déjà chargée
		if (!user.blockedUsers) {
			user.blockedUsers = await this.usersRepository.createQueryBuilder('user')
				.relation(User, 'blockedUsers')
				.of(user)
				.loadMany();
		}
	
		// Vérifie si l'utilisateur est déjà bloqué
		if (user.blockedUsers.some(u => u.id === blockedUserId)) {
			return; // L'utilisateur est déjà bloqué, donc rien à faire
		}
	
		user.blockedUsers.push(blockedUser);
		await this.usersRepository.save(user);
	}
}
