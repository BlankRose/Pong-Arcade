import { IsNotEmpty, IsOptional } from "class-validator";
import { Channel } from "../entities/channel.entity";
import { User } from "src/users/user.entity";


export class NewMessageDto {
    @IsNotEmpty()
    senderId: number

    @IsNotEmpty()
    content: string

    @IsOptional()
    username: string

    @IsNotEmpty()
    channelId: number

    @IsOptional()
    channel: Channel

    @IsOptional()
    creationDate: Date
}