import { IsNotEmpty, IsOptional } from "class-validator";
import { Channel } from "../entities/channel.entity";
import { User } from "src/users/user.entity";


export class NewMessageDto {
    @IsNotEmpty()
    sender: User

    @IsNotEmpty()
    content: string

    @IsOptional()
    channel: Channel

    @IsOptional()
    creationDate: Date
}