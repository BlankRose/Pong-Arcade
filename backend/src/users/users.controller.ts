// users.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('block')
  blockUser(@Body() blockUserDto: BlockUserDto) {
    return this.usersService.blockUser(blockUserDto.userId, blockUserDto.blockedUserId);
  }
}