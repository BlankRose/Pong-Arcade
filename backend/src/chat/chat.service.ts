import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository, MoreThanOrEqual } from "typeorm";
import Channel from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ChannelMember from "./entities/channel_member.entity";
import Message from "./entities/message.entity";
import { User } from "src/users/user.entity";
import { GetMessageDto } from "./dto/message.dto";
import { NewChannelDto } from "./dto/channel.dto";

@Injectable()
export class ChatService
{
	constructor(
		@InjectRepository(Channel)
		private channelRepo: Repository<Channel>,

		@InjectRepository(ChannelMember)
		private membersRepo: Repository<ChannelMember>,

		@InjectRepository(Message)
		private messageRepo: Repository<Message>,

		@InjectRepository(User)
		private userRepo: Repository<User>,
	) {}

	async createChannel(username: string, request: NewChannelDto) {
		// To-Do
	}

	async getChannels(username: string) {
		const user = this.userRepo.findOne({
			where: { username: username },
			relations: ['channels']
		});

		return (await user).channels;
	}

	async getMessages(username: string, request: GetMessageDto) {
		const user: User = await this.userRepo.findOne({
			where: { username: username },
			relations: ['channels']
		});

		const channel: Channel = await this.channelRepo.findOne({
			where: { id: request.channel },
			relations: ['messages', 'members']
		});

		if (!channel)
			throw new UnauthorizedException();

		const is_member = (() => {
			for (let i = 0; i < channel.members.length; i++) {
				if (channel.members[i].user.id == user.id)
					return true;
			}
			return false;
		})();

		if (!is_member)
			throw new UnauthorizedException();

		if (!request.from)
			return channel.messages;

		return await this.messageRepo.find({
			where: { timestamp: MoreThanOrEqual(request.from) }
		});
	}
}
