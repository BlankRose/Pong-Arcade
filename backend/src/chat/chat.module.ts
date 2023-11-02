import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Message from "./entities/message.entity";
import Channel from "./entities/channel.entity";
import ChannelMember from "./entities/channel_member.entity";
import { User } from "src/users/user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, ChannelMember, Message, User])
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})

export class ChatModule {}
