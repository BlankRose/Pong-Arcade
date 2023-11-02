// src/channels/dto/create-direct-message.dto.ts

export class CreateDirectMessageDto {
    senderId: number;
    recipientId: number;
    content: string;
  }