import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Message from "./entities/message.entity";
import Channel from "./entities/channel.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, Message])
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})

export class ChatModule {}
