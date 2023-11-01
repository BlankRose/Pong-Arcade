import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
import { User } from "src/users/user.entity";

@Entity()
class Message {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.messages)
	sender: User;

	@ManyToOne(() => Channel, channel => channel.messages)
	channel: Channel;

	@Column()
	content: string;

	@Column({ default: null })
	timestamp: Date;

}

export default Message;
