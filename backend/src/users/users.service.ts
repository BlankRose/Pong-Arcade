// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { User, UserStatus } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { Game } from 'src/game/entities/game.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(Game)
		private readonly gamesRepository: Repository<Game>
	) {}

	getAllUsers(): Promise<User[]> {
		return this.usersRepository.find();
	}

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
		delete user._2FAToken;
		delete user._2FAEnabled;

		return user;
	}

	quickFix(user: User): User {
		if (!user)
			return undefined;

		if (!(user.win >= 0))
			user.win = 0;
		if (!(user.lose >= 0))
			user.lose = 0;
		if (!(user.streak >= 0))
			user.streak = 0;

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

	async sessionStatus(id: number): Promise<UserStatus> {
		const user = await this.findOneByID(id);
		return user.status;
    }

	async toggleStatus (target: number, status: UserStatus) {
		try {
			const user = await this.findOneByID(target)
			if (user) {
				this.usersRepository.update(target, {status: status})
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	async createUserFrom42(data: any): Promise<User> {
		const existingUser = await this.usersRepository.findOne({ where: { username: data.username } });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash('', 10);
		user.status = UserStatus.Online 

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

	async updateUser(target: number, user: User)
	{
		await this.usersRepository.update(target, user);
	}

	async replaceAvatar(target: number, newAvatar: UploadAvatarDto): Promise<User>
	{
		if (!newAvatar || !newAvatar.data)
			throw new BadRequestException('Missing the avatar');

		if (!newAvatar.data.startsWith('http'))
		{
			const type = newAvatar.data.split(';')[0].split('/')[1];
			if (type !== 'png' && type !== 'jpg' && type !== 'jpeg'
				&& type !== 'gif' && type !== 'bmp' && type !== 'svg'
				&& type !== 'webp' && type !== 'ico')
				throw new BadRequestException('Unsupported image type');
		}

		await this.usersRepository.update(target, { avatar: newAvatar.data });
		return this.purgeData(await this.findOneByID(target));
	}

	async removeAvatar(target: number): Promise<User>
	{
		await this.usersRepository.update(target, { avatar: null });
		return this.purgeData(await this.findOneByID(target));
	}

	async getUserInfo(username: string) {
		const user = await this.findOne(username)
		if(!user) {
			throw new NotFoundException('User does not exist')
		}
		console.log("**************", user)
		const {_2FAToken, id42, password, ...rest} = user
		console.log("**************", rest)

		return rest
	}

	async getHistory(user: User): Promise<Game[]> {
		const history = await this.gamesRepository.find({
			relations: ['playerOne', 'playerTwo'],
			where: [{ playerOne: user }, { playerTwo: user }]
		})

		history.forEach(elem => {
			elem.playerOne = this.purgeData(elem.playerOne);
			elem.playerTwo = this.purgeData(elem.playerTwo);
		});

		return history;
	}

// ************************2FA Part************************
	async turnOn2FA(userID: number) {
        try {
            const user = await this.usersRepository.findOne({where: { id: userID }})
            if (user) {
                user._2FAEnabled = true
                return this.usersRepository.save(user)
            }
            console.log(`User with id ${userID} does not exist`)
        } catch (error) {
            console.error(error)
        }
    }

	async turnOff2FA(userID: number) {
        try {
            const user = await this.usersRepository.findOne({where: { id: userID },})
            if (user) {
                user._2FAEnabled = false
                return this.usersRepository.save(user)
            }
            console.log(`User with id ${userID} does not exist`)
        } catch (error) {
            console.error(error)
        }
    }

	async set2FASecret (secret: string, userID: number) {
		try {
			const user = await this.usersRepository.findOne({where: {id: userID}})
			if (user) {
				user._2FAToken = secret
				return this.usersRepository.save(user)
			}
			console.warn(`User with  id=${userID} does not exist`)
		} catch (error) {
			console.warn (error)
		}
	}

// ************************2FA Part************************

//***********************History Match *********************
}