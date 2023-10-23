import { Controller, Get, Post, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController
{
	constructor(
		private chatService: ChatService
	) {}

	@Get('channels')
	getChannels(@Request() req) {
		return this.chatService.getChannels(req.user['username']);
	}

	@Post('test')
	test(@Request() req) {
		return this.chatService.test(req.user['username']);
	}
}
