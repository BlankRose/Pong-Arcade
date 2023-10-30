// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { User} from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

		// TO-DO: Call 42 API to convert code into actual auth token
		//        and retrieve user information thru the new token
		user.id42 = data.code;
		const savedUser = await this.usersRepository.save(user);
		return savedUser;
	}

	async validateUserPassword(username: string, rawPassword: string): Promise<boolean> {
		const user = await this.usersRepository.findOne({ where: { username: username } });
		if (!user) {
				return false; // Utilisateur non trouvé
		}
		const isMatch = await bcrypt.compare(rawPassword, user.password);
		return isMatch; // Renvoie true si le mot de passe est valide, false sinon
	}

	/*
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
	*/

	//fonction remplacant le nouveau username par l'ancien;

	async replaceUsername(target: number, newUserName: string): Promise<User>
	{
		if (!newUserName)
			throw new BadRequestException('Missing \'username\' parameter');
		const existingUser = await this.findOne(newUserName);
		if (existingUser)
			throw new ConflictException('Username already exists');

		console.log('New:', newUserName, 'for', target);
		await this.usersRepository.update(target, { username: newUserName });
		const updateUser = await this.findOneByID(target);
		console.log('Next:', updateUser.username);

		return this.purgeData(updateUser);
	}
}
