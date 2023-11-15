import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository, MoreThanOrEqual } from "typeorm";
import {Channel} from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ChannelMessage from "./entities/channelMessage.entity";
import { User } from "src/users/user.entity";
import { NewMessageDto } from "./dto/create-message.dto";
import { NewChannelDto } from "./dto/create-channel.dto";
import * as bcrypt from 'bcrypt'

enum ChannelType {
    Private = 'private',
    Public = 'public',
    Direct = 'direct',
}

export default ChannelType

@Injectable()
export class ChatService
{
	constructor(
		@InjectRepository(Channel)
		private channelRepo: Repository<Channel>,

		@InjectRepository(ChannelMessage)
		private messageRepo: Repository<ChannelMessage>,

		@InjectRepository(User)
		private userRepo: Repository<User>,
	) {}


	async createMessage(newMessage: NewMessageDto) {
		const user = await this.userRepo.findOneBy({ id: newMessage.senderId,})
		const { username} = user
		newMessage.userNickname = username
		const newMsg = this.messageRepo.create(newMessage)
		return await this.messageRepo.save(newMsg)
	}
	
	async createChannel(newChannel: NewChannelDto) {
		const user = await this.userRepo.findOneBy({
            id: newChannel.ownerId,
        })
		newChannel.owner = user
		newChannel.admin = [user]
		newChannel.members = [user]
		newChannel.messages = []
		

		if (newChannel.password) {
			const password = newChannel.password
			newChannel.password = await bcrypt.hash(password, 10)
		}

		const createdNewChannel = this.channelRepo.create(newChannel)
		return (this.channelRepo.save(createdNewChannel))
	}

	async addUserToChannel (channelId: number, userId: number, password: string) {
		const channel = await this.channelRepo.findOne({
			relations: ['members', 'bannedUsers'],
			where: {id: channelId}})
		const user = await this.userRepo.findOne({where: { id: userId }})
		if (channel.type === ChannelType.Private) {
			const isValidPassword = await bcrypt.compare(password, channel.password)
			if (!isValidPassword) {
				throw new UnauthorizedException()
			}
		}
		channel.members.push(user)
		return await this.channelRepo.save(channel)
	}

	async removeUserFromChannel (channelId: number, userId: number) {
		const channel = await this.channelRepo.findOne({relations: ['members'], where: {id: channelId}})
		const user = await this.userRepo.findOne({where: { id: userId }})
		channel.members = channel.members.filter(x => x.id !== user.id)
		return await this.channelRepo.save(channel)
	}

	async changePassword (channelId: number, password: string) {
		try {
			const channel = await this.channelRepo.findOne({where: { id: channelId }})
			channel.password = await bcrypt.hash(password, 10)
		    await this.channelRepo.update(channel.id, channel)
		    return true
		} catch (error) {
			return false
		}
	}

	async deleteChannel (channelId: number, userId: number) {
		const channel = await this.channelRepo.findOne({where: {id: channelId}})
		return await this.channelRepo.remove(channel)
	}

	async getChannels() {
		return await this.channelRepo.find({
            relations: ['owner', 'admins', 'members', 'messages'],
        })
	}

	async ReturnAllMsg(channelId: number): Promise<ChannelMessage[]> {
        const messages = await this.messageRepo.createQueryBuilder('message').where('message.channelId = :channelId', { channelId }).getMany()

        return messages
    }

	async findChannelMessages (channelId: number) : Promise<ChannelMessage[]> {
		const messages = await this.messageRepo.createQueryBuilder('message').where('message.channelId = :channelId', {channelId}).getMany()
		return messages;
	}

	async findChannelMembers (channelId: number) {
		return await this.channelRepo.findOne({
			relations :{
				owner: true,
				members: true,
				admins: true,
				bannedUsers: true,
			},
			where : {id : channelId}
		})
	}



	// async getMessages(username: string, request: GetMessageDto) {
	// 	const user: User = await this.userRepo.findOne({
	// 		where: { username: username },
	// 		relations: ['channels']
	// 	});

	// 	const channel: Channel = await this.channelRepo.findOne({
	// 		where: { id: request.channel },
	// 		relations: ['messages', 'members']
	// 	});

	// 	if (!channel)
	// 		throw new UnauthorizedException();

	// 	const is_member = (() => {
	// 		for (let i = 0; i < channel.members.length; i++) {
	// 			if (channel.members[i].user.id == user.id)
	// 				return true;
	// 		}
	// 		return false;
	// 	})();

	// 	if (!is_member)
	// 		throw new UnauthorizedException();

	// 	if (!request.from)
	// 		return channel.messages;

	// 	return await this.messageRepo.find({
	// 		where: { timestamp: MoreThanOrEqual(request.from) }
	// 	});
	// }
}
