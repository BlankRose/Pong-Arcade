// src/messages/messages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
})
export class MessagesModule {}