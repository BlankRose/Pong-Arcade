// channels.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.createChannel(createChannelDto.name, createChannelDto.ownerId);
  }

  @Post('direct-messages')
  createDirectMessage(@Body() createDirectMessageDto: CreateDirectMessageDto) {
  return this.channelsService.createDirectMessage(createDirectMessageDto);
}
}