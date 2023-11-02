import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
import { User } from "src/users/user.entity";

@Entity()
class Message {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;
	
	@CreateDateColumn()
    creationDate: Date

	@ManyToOne(() => User, user => user.messages, {onDelete: 'CASCADE'})
	sender: User;

	@ManyToOne(() => Channel, channel => channel.messages, {onDelete: 'CASCADE'})  
	channel: Channel;

}

export default Message;
