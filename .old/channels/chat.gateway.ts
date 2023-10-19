// src/channels/chat.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChannelsService } from './channels.service'; // Importez votre service si nécessaire
  
  @WebSocketGateway()
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    constructor(private readonly channelsService: ChannelsService) {}
  
    afterInit(server: Server) {
      console.log('Initialized!');
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: any): void {
      const { channelId, content } = payload;
      // Ici, vous pouvez traiter le message, par exemple, le sauvegarder dans la base de données
      // et émettre un événement 'newMessage' à tous les clients connectés au même channel
      this.server.to(String(channelId)).emit('newMessage', { ...payload, senderName: client.id });
    }

    @SubscribeMessage('joinChannel')
    handleJoinChannel(client: Socket, channelId: number): void {
      client.join(String(channelId));
      console.log(`Client ${client.id} joined channel ${channelId}`);
    }

    @SubscribeMessage('leaveChannel')
    handleLeaveChannel(client: Socket, channelId: number): void {
      client.leave(String(channelId));
      console.log(`Client ${client.id} left channel ${channelId}`);
    }
    
  }