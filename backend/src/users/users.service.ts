import * as bcrypt from 'bcrypt';
import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {User, UserStatus} from './user.entity';
import {Friend} from '../friends/friends.entity'
import {FriendsService} from '../friends/friends.service'
import {Channel} from '../chat/entities/channel.entity'
import {InjectRepository} from '@nestjs/typeorm';
import {In, Not, Repository} from 'typeorm';
import {UploadAvatarDto} from './dto/upload-avatar.dto';
import {Game} from 'src/game/entities/game.entity';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	channelsRepo: any;
	constructor(
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
		private readonly friendsService: FriendsService,
        @InjectRepository(Friend)
        private readonly friendRepo: Repository<Friend>,
        @InjectRepository(Channel)
        private readonly channelRepo: Repository<Channel>,
		@InjectRepository(Game)
		private readonly gamesRepository: Repository<Game>
	) {}

	getAllUsers(): Promise<User[]> {
		return this.usersRepo.find();
	}

	async findOne(username: string): Promise<User | undefined> {
		return this.usersRepo.findOne({ where: { username: username } });
	}

	async findOneByID(id: number): Promise<User | undefined> {
		return this.usersRepo.findOne({where: {id: id}});
	}

	// Removes critical information of the User data
	// /!\ USE BEFORE SENDING USER AS REPLY
	purgeData(user: User): User {
		if (!user)
			return undefined;

		delete user.password;
		delete user.id42;
		delete user._2FAToken;

		return user;
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
		return this.usersRepo.findOne({ where: { id42: id42 } });
	}

	async createUser(data: any): Promise<User> {
		// Vérifiez si l'utilisateur existe déjà
		const existingUser = await this.usersRepo.findOne({ where: { username: data.username } });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash(data.password, 10);
		user._2FAEnabled = false

		const createdUser = await this .usersRepo.create(user)
		const savedUser = await this.usersRepo.save(createdUser);
		return savedUser;
	}

	async updateUser(id: number, updatedinfo: UpdateUser) {
		try {
			const user = await this.findOneByID(id)
			return this.usersRepo.save({...user, ...updatedinfo})
		} catch (err) {
			console.error(err)
		}
	}

	async removeUser (id: number) {
		try {
			const user = await this.findOneByID(id)
			// await this.channelsRepo.delete({ owner: user });
			return this.usersRepo.remove(user)
		} catch (err) {
			console.error("error: ", err)
		}
	}

	async returnUsers() {
		return ( await this.usersRepo.find())
	}

	async sessionStatus(id: number): Promise<UserStatus> {
		const user = await this.findOneByID(id);
		if (!user) {
			return UserStatus.Offline
		}
		return user.status;
    }

	async toggleStatus (target: number, status: UserStatus) {
		try {
			const user = await this.findOneByID(target)
			if (user) {
				this.usersRepo.update(target, {status: status})
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	async turnOnline (userId: number) {
		try {
			const user = await this.findOneByID(userId)

			if (user && user.status != UserStatus.Online) {
				this.usersRepo.update(userId, {id: userId, status: UserStatus.Online})
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	async setIsNeed2FA (userId: number) {
		try {
			const user = await this.findOneByID(userId)

			if (user ) {
				this.usersRepo.update(userId, {id: userId, is2FANeeded: user._2FAEnabled})
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	async toogleIsNeed2FA (userId: number) {
		try {
			const user = await this.findOneByID(userId)

			if (user ) {
				this.usersRepo.update(userId, {id: userId, is2FANeeded: false})
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	async logout(userId: number) {
		try {
			const user= await this.findOneByID(userId)
			if (!user) {
				throw new NotFoundException()
			}
			this.updateUser(user.id, {id: userId, status: UserStatus.Offline})
		} catch (err) {
			console.log(err)
		}
	}

	async createUserFrom42(data: any): Promise<User> {
		const existingUser = await this.usersRepo.findOne({ where: { username: data.username } });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const user = new User();
		user.username = data.username;
		user.password = await bcrypt.hash('', 10);
		user.status = UserStatus.Online 

		user.id42 = data.code;
		const savedUser = await this.usersRepo.save(user);
		return savedUser;
	}

	async validateUserPassword(username: string, rawPassword: string): Promise<boolean> {
		const user = await this.usersRepo.findOne({ where: { username: username } });
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
			await this.usersRepo.update(target, { username: newUserName });
		else if (existingUser.id !== target)
			throw new ConflictException('Username already exists');

		const updateUser = await this.findOneByID(target);
		return this.purgeData(updateUser);
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

		await this.usersRepo.update(target, { avatar: newAvatar.data });
		return this.purgeData(await this.findOneByID(target));
	}

	async removeAvatar(target: number): Promise<User>
	{
		await this.usersRepo.update(target, { avatar: null });
		return this.purgeData(await this.findOneByID(target));
	}

	async getUserInfo(username: string) {
		const user = await this.findOne(username)
		if(!user) {
			throw new NotFoundException('User does not exist')
		}
		const {_2FAToken, id42, password, ...rest} = user

		return rest
	}

// ************************2FA Part************************
	async turnOn2FA(userID: number) {
        try {
            const user = await this.usersRepo.findOne({where: { id: userID },})
            if (user) {
                user._2FAEnabled = true
	
                return this.usersRepo.save(user)
            }
            console.log(`User with id ${userID} does not exist`)
        } catch (error) {
            console.error(error)
        }
    }

	async turnOff2FA(userID: number) {
        try {
            const user = await this.usersRepo.findOne({where: { id: userID },})
            if (user) {
                user._2FAEnabled = false
                return this.usersRepo.save(user)
            }
            console.log(`User with id ${userID} does not exist`)
        } catch (error) {
            console.error(error)
        }
    }

	async set2FASecret (secret: string, userID: number) {
		try {
			const user = await this.usersRepo.findOne({where: {id: userID}})
			if (user) {
				user._2FAToken = secret
				return this.usersRepo.save(user)
			}
			console.warn(`User with  id=${userID} does not exist`)
		} catch (error) {
			console.warn (error)
		}
	}

// ************************2FA Part************************

async getFriendsAndRequests(userId: number) {
	const user = await this.usersRepo.findOne({where: {id: userId}})
	if (!user) {
		throw new NotFoundException('User not found')
	}
	return this.friendsService.fetchUserConnections(user.id)
}

async getAllUsersWithNoFriendship(userId: number) {
	const user = await this.usersRepo.findOne({where: {id: userId}})
	if (!user) {
		throw new NotFoundException('User not found')
	}

	const friendsAddedByMe = await this.friendRepo
		.createQueryBuilder('friend')
		.select('friend.friendId', 'friendId')
		.where('friend.userId = :userId', { userId })
		.getRawMany()

	const friendsWhoAddedMe = await this.friendRepo
		.createQueryBuilder('follower')
		.select('follower.userId', 'userId')
		.where('follower.friendId = :userId', { userId })
		.getRawMany()

	const friendsByMeIds = friendsAddedByMe.map((friend) => friend.friendId)

	const friendsByOthersIds = friendsWhoAddedMe.map(
		(follower) => follower.userId
	)

	const usersNotFriends = await this.usersRepo.find({
		where: {
			id: Not(In([...friendsByMeIds, ...friendsByOthersIds, userId])),
		},
		select: ['id', 'username', 'avatar'],
	})

	if (!usersNotFriends) {
		throw new NotFoundException('Users not found')
	}
	return { usersNotFriends }
}

}