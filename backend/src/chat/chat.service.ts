import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository, MoreThanOrEqual } from "typeorm";
import {Channel} from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ChannelMessage from "./entities/channelMessage.entity";
import { User } from "src/users/user.entity";
import { NewMessageDto } from "./dto/create-message.dto";
import { NewChannelDto } from "./dto/create-channel.dto";

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
		const newMess = this.messageRepo.create(newMessage)
		return await this.messageRepo.save(newMess)
	}
	
	async createChannel(username: string, request: NewChannelDto) {
		// To-Do
	}

	async getChannels(username: string) {
		const user = this.userRepo.findOne({
			where: { username: username },
			relations: ['channels']
		});

		return (await user).joinedChannels;
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
