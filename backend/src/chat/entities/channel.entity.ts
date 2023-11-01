import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Message from "./message.entity";
import { User } from "src/users/user.entity";
import ChannelMember from "./channel_member.entity";

@Entity()
class Channel {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.ownedChannels)
	owner: User;

	@Column()
	name: string;

	@Column()
	status: string;

	@Column({ default: null })
	password: string;

	@OneToMany(() => ChannelMember, member => member.channel)
	members: ChannelMember[];

	@OneToMany(() => Message, message => message.channel)
	messages: Message[];

}

export default Channel;
