import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import Channel from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ChannelMember from "./entities/channel_member.entity";
import Message from "./entities/message.entity";
import { User } from "src/users/user.entity";

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

	async getChannels(username: string) {
		const user = this.userRepo.findOne({
			where: { username: username },
			relations: ['channels']
		})

		return (await user).channels;
	}
}
