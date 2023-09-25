// channels.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channels.entity';
import { User } from '../users/user.entity';
import { Message } from '../messages/messages.entity';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createChannel(name: string, ownerId: number): Promise<Channel> {
    const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new Error('User not found');
    }
    const newChannel = this.channelsRepository.create({ name, owner });
    return this.channelsRepository.save(newChannel);
  }

  async createDirectMessage(dto: CreateDirectMessageDto): Promise<Message> {
    let channel = await this.findPrivateChannelBetweenUsers(dto.senderId, dto.recipientId);
    if (!channel) {
      const sender = await this.usersRepository.findOne({ where: { id: dto.senderId } });
      const recipient = await this.usersRepository.findOne({ where: { id: dto.recipientId } });
      if (!sender || !recipient) {
        throw new Error('User not found');
      }
      channel = await this.createPrivateChannel(sender, recipient);
    }
    const message = this.messagesRepository.create({
        content: dto.content,
        user: { id: dto.senderId } as User,
        channel: { id: channel.id } as Channel,
      });
    return this.messagesRepository.save(message);
  }

  private async findPrivateChannelBetweenUsers(senderId: number, recipientId: number): Promise<Channel | undefined> {
    const channels = await this.channelsRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'user')
      .where('channel.isPrivate = true')
      .andWhere('user.id IN (:senderId, :recipientId)', { senderId, recipientId })
      .getMany();
    
    return channels.find(channel => 
      channel.users.length === 2 && 
      channel.users.some(user => user.id === senderId) && 
      channel.users.some(user => user.id === recipientId)
    );
  }

  private async createPrivateChannel(sender: User, recipient: User): Promise<Channel> {
    const newChannel = this.channelsRepository.create({
      isPrivate: true,
      users: [sender, recipient]
    });
    return this.channelsRepository.save(newChannel);
  }

  async addAdminToChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['admins'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.admins.push(user);
    return this.channelsRepository.save(channel);
  }

  // Dans ChannelsService
  async banUserFromChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['bannedUsers'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.bannedUsers.push(user);
    return this.channelsRepository.save(channel);
  }

  async removeAdminFromChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['admins'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.admins = channel.admins.filter(admin => admin.id !== userId);
    return this.channelsRepository.save(channel);
  }

  async unbanUserFromChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['bannedUsers'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.bannedUsers = channel.bannedUsers.filter(bannedUser => bannedUser.id !== userId);
    return this.channelsRepository.save(channel);
  }

  async muteUserInChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['mutedUsers'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.mutedUsers.push(user);
    return this.channelsRepository.save(channel);
  }

  async unmuteUserInChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['mutedUsers'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.mutedUsers = channel.mutedUsers.filter(mutedUser => mutedUser.id !== userId);
    return this.channelsRepository.save(channel);
  }

  async joinChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['users'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.users.push(user);
    return this.channelsRepository.save(channel);
  }

  async leaveChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId }, relations: ['users'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    channel.users = channel.users.filter(u => u.id !== userId);
    return this.channelsRepository.save(channel);
  }

  async sendMessageToChannel(channelId: number, userId: number, content: string): Promise<Message> {
    const channel = await this.channelsRepository.findOne({ where: { id: channelId } });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!channel || !user) {
      throw new Error('Channel or User not found');
    }
    const message = this.messagesRepository.create({ content, user, channel });
    return this.messagesRepository.save(message);
  }
  // Ajoutez ici vos autres méthodes pour gérer les channels
}