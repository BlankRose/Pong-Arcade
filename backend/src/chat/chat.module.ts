import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Message from "./entities/channelMessage.entity";
import {Channel} from "./entities/channel.entity";
import { User } from "src/users/user.entity";
import { ChatGateway } from "./chat.gateway";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, Message, User])
	],
	providers: [ChatGateway, ChatService],
	exports: [ChatService],
})

export class ChatModule {}
