// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
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
		return this.usersRepository.findOne({ where: { username: username } });
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

		// Créez une nouvelle instance de l'entité User
		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash(data.password, 10);

		// Sauvegardez l'instance dans la base de données
		const savedUser = await this.usersRepository.save(user);
		return savedUser;
	}

	async createUserFrom42(data: any): Promise<User> {
		// Vérifiez si l'utilisateur existe déjà
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


}
