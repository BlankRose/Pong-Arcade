import { IsNotEmpty, IsOptional } from "class-validator";
import {User} from '../../users/user.entity';
import Message from '../entities/channelMessage.entity';



export class NewChannelDto {
	@IsNotEmpty()
	name: string

	@IsNotEmpty()
    type: 'public' | 'private';

	@IsOptional()
	isProtected: boolean;

	@IsOptional()
	password: string

	@IsOptional()
	members: User[]

}
