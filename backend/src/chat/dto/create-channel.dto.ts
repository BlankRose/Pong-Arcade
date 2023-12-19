import { IsNotEmpty, IsOptional } from "class-validator";
import {User} from '../../users/user.entity';
import ChannelMessage from '../entities/channelMessage.entity';



export class NewChannelDto {

	@IsNotEmpty()
	name: string

	@IsNotEmpty()
	ownerId: number

	@IsOptional()
	owner: User

	@IsNotEmpty()
    type: 'public' | 'private' | 'direct';

	@IsOptional()
	isProtected: boolean;

	@IsOptional()
	password: string

	@IsOptional()
	members: User[]

	@IsOptional()
	admins: User[];

	@IsOptional()
    messages: ChannelMessage[]

}
