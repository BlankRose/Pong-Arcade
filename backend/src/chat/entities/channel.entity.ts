import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import Message from "./message.entity";
import { User } from "src/users/user.entity";

@Entity()
class Channel {

	@PrimaryColumn()
	id: number;

	@ManyToOne(() => User, user => user.ownedChannels)
	owner: User;

	@Column()
	name: string;

	@Column()
	status: string;

	@Column({ default: null })
	password: string;

	@ManyToMany(() => User, user => user.adminChannels)
	@JoinTable()
	admins: User[];

	@OneToMany(() => Message, message => message.channel)
	messages: Message[];

}

export default Channel;
