// src/users/user.entity.ts
import Channel from 'src/chat/entities/channel.entity';
import ChannelMember from 'src/chat/entities/channel_member.entity';
import Message from 'src/chat/entities/message.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

	/* ********************** */
	/* Account Authentication */
	/* ********************** */

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

	@Column({ default: -1 })
	id42: number;

	@Column({ default: null })
	token2FA: string;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({ default: "../../../frontend/src/assets/avatar.jpeg" })
	avatar: string;

	@ManyToMany(() => User)
	@JoinColumn()
	friends: User[];

	@ManyToOne(() => User)
	@JoinColumn()
	friendRequest: User;

	@ManyToMany(() => User)
	@JoinColumn()
	blocked: User[];

	/* ********************** */
	/*   Account Statistics   */
	/* ********************** */

	@Column({ default: 0 })
	win: number;

	@Column({ default: 0 })
	lose: number;

	@Column({ default: 0 })
	streak: number;

	@Column({ default: 0 })
	rank: number;

	/* ********************** */
	/*        Chatting        */
	/* ********************** */

	@OneToMany(() => Channel, channel => channel.owner)
	ownedChannels: Channel[];

	@OneToMany(() => ChannelMember, member => member.user)
	channels: ChannelMember[];

	@OneToMany(() => Message, message => message.sender)
	messages: Message[];

}
