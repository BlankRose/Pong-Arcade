import { Controller, Get, Post, Request, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";

import { GetMessageDto } from "./dto/message.dto";
import { NewChannelDto } from "./dto/channel.dto";

@Controller('chat')
export class ChatController
{
	constructor(
		private chatService: ChatService
	) {}

	@Get('channels')
	getChannels(@Request() req) {
		return this.chatService.getChannels(req.user['id']);
	}

	@Post('channel')
	createChannel(@Request() req, @Body() body: NewChannelDto) {
		return this.chatService.createChannel(req.user['id'], body);
	}

	@Get('messages')
	getMessages(@Request() req, @Body() body: GetMessageDto) {
		return this.chatService.getMessages(req.user['id'], body);
	}
}
