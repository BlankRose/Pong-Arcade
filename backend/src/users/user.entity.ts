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
	JoinColumn,
} from 'typeorm';

export enum UserStatus {
    Online = 'online',
    Offline = 'offline',
    Playing = 'playing',
}

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

	@Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.Offline,
    })
    status: UserStatus

	@Column ({default: false})
	_2FAEnabled: boolean;

	@Column({ default: null })
	_2FAToken: string;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({ default: null })
	avatar: string;

	@ManyToMany(() => User)
	@JoinColumn()
	friends: User[];

	@ManyToMany(() => User)
	@JoinColumn()
	friendRequest: User[];

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

	@Column({type: "decimal", scale: 2, default: 0 })
	streak: number;

	@Column({ default: 1 })
	rank: number;

	@Column({default: 0})
	xp: number;

	//Stat for the ladder
	@Column({default: 500})
	elo: number;


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
