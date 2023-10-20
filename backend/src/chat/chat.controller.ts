import { Controller, Get } from "@nestjs/common";

@Controller('chat')
export class ChatController
{
	@Get('channels')
	getChannels() {
		return 'channels';
	}
}
