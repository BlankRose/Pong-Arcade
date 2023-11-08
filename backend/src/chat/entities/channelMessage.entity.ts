import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {Channel} from "./channel.entity";
import { User } from "src/users/user.entity";

@Entity()
class ChannelMessage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;
	
	@CreateDateColumn()
    creationDate: Date

	@ManyToOne(() => User, user => user.channelMessages, {onDelete: 'CASCADE'})
	sender: User;

	@ManyToOne(() => Channel, channel => channel.messages, {onDelete: 'CASCADE'})  
	channel: Channel;

}

export default ChannelMessage;
