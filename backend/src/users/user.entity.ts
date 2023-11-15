// src/users/user.entity.ts
import {Channel} from '../chat/entities/channel.entity';
import ChannelMessage from 'src/chat/entities/channelMessage.entity';
import Message from 'src/chat/entities/channelMessage.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	ManyToOne,
	JoinColumn,
	JoinTable,
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

	@Column({ default: false})
	is2FANeeded: boolean;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({ default: null })
	avatar: string;

	// @ManyToMany(() => User)
	// @JoinColumn()
	// friends: User[];

	// @ManyToMany(() => User)
	// @JoinColumn()
	// friendRequest: User[];

	// @ManyToMany(() => User)
	// @JoinColumn()
	// blocked: User[];

	/* ********************** */
	/*   Account Statistics   */
	/* ********************** */

	@Column({ default: 0 })
	win: number;

	@Column({ default: 0 })
	lose: number;

	@Column({ default: 0 })
	streak: number;

	@Column({ default: 1 })
	rank: number;

	/* ********************** */
	/*    Channels Chatting   */
	/* ********************** */

	@OneToMany(() => Channel, channel => channel.owner)
	ownedChannels: Channel[];

	@ManyToMany(() => Channel, channel => channel.admins)
	@JoinTable()
	adminInChannels: Channel[];

	@ManyToMany(() => Channel, (channel) => channel.members)
	@JoinTable()
	joinedChannels: Channel[];

	@ManyToMany(() => Channel, channel => channel.bannedUsers)
	@JoinTable()
	bannedInChannels: Channel[];

	@OneToMany(() => Channel, channel => channel.mutedUsers)
	@JoinTable()
	mutedInChannels: Channel[];

	// @OneToMany(() => Message, message => message.sender)
	// channelMessages: ChannelMessage[];

	/* ********************** */
	/*    Direct Messages     */
	/* ********************** */
   

	// do it later


}
