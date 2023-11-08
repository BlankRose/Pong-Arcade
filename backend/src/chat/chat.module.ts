import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Message from "./entities/channelMessage.entity";
import {Channel} from "./entities/channel.entity";
import { User } from "src/users/user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, Message, User])
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})

export class ChatModule {}
