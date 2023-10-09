// src/channels/channels.module.ts
import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channels.entity';
import { User } from '../users/user.entity'; // Assurez-vous que le chemin d'importation est correct
import { Message } from '../messages/messages.entity'; // Assurez-vous que le chemin d'importation est correct
import { UsersModule } from '../users/users.module'; // Assurez-vous que le chemin d'importation est correct
import { MessagesModule } from '../messages/messages.module'; // Assurez-vous que le chemin d'importation est correct
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, Message]),
    UsersModule, // Importez UsersModule si UserRepository est défini dans ce module
    MessagesModule, // Importez MessagesModule si MessageRepository est défini dans ce module
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChatGateway],
})
export class ChannelsModule {}