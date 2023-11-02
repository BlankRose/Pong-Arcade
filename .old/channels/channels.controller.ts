// channels.controller.ts
import {
    Delete,
  } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Param } from '@nestjs/common';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { Get } from '@nestjs/common';


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

  @Post(':channelId/ban/:userId')
  banUserFromChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
  return this.channelsService.banUserFromChannel(channelId, userId);
  }

  @Post(':channelId/admins/:userId')
  addAdminToChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.addAdminToChannel(channelId, userId);
  }

  @Delete(':channelId/admins/:userId')
  removeAdminFromChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.removeAdminFromChannel(channelId, userId);
  }


  @Delete(':channelId/ban/:userId')
  unbanUserFromChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.unbanUserFromChannel(channelId, userId);
  }

  @Post(':channelId/mute/:userId')
  muteUserInChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.muteUserInChannel(channelId, userId);
  }

  @Delete(':channelId/mute/:userId')
  unmuteUserInChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.unmuteUserInChannel(channelId, userId);
  }

  @Post(':channelId/join/:userId')
  joinChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.joinChannel(channelId, userId);
  }

  @Post(':channelId/leave/:userId')
  leaveChannel(@Param('channelId') channelId: number, @Param('userId') userId: number) {
    return this.channelsService.leaveChannel(channelId, userId);
  }

  @Post(':channelId/messages')
  sendMessageToChannel(@Param('channelId') channelId: number, @Body() createMessageDto: CreateMessageDto) {
    return this.channelsService.sendMessageToChannel(channelId, createMessageDto.userId, createMessageDto.content);
  }

  @Get()
  findAll() {
    // Retourner la liste des channels ici
    // Vous pouvez appeler une méthode appropriée de channelsService pour récupérer la liste des channels
    return this.channelsService.findAllChannels();
  }

}