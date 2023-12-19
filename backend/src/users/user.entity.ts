import {Channel} from '../chat/entities/channel.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Friend } from '../friends/friends.entity';
import { MutedUserChannel } from '../chat/entities/muted-user.entity';

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


	/* ********************** */
	/*        Friends         */
	/* ********************** */

	@OneToMany(() => Friend, (friend) => friend.user)
    friends: Friend[];

    @OneToMany(() => Friend, (friend) => friend.friend)
    friendsAdded: Friend[];

    @OneToMany(() => Friend, (friend) => friend.createdBy)
    FriendsInvitedBy: Friend[];

    @ManyToMany(() => User, (user) => user.blockers)
    @JoinTable()
    blockedMembers: User[]

    @ManyToMany(() => User, (user) => user.blockedMembers)
    blockers: User[]

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
	/*    Channels Chatting   */
	/* ********************** */

	@OneToMany(() => Channel, channel => channel.owner)
	ownedChannels: Channel[];

	@ManyToMany(() => Channel, channel => channel.admins)
	@JoinTable()
	admins: Channel[];

	@ManyToMany(() => Channel, (channel) => channel.members)
	@JoinTable()
	joinedChannels: Channel[];

	@ManyToMany(() => Channel, channel => channel.bannedUsers)
	@JoinTable()
	bannedInChannels: Channel[];

	// @OneToMany(() => Channel, channel => channel.muted)
	// @JoinTable()
	// mutedInChannels: Channel[];

	@OneToMany(() => MutedUserChannel, (channel) => channel.mutedUser)
    mutedInChannel: MutedUserChannel[]

	// @OneToMany(() => Message, message => message.sender)
	// channelMessages: ChannelMessage[];

	/* ********************** */
	/*    Direct Messages     */
	/* ********************** */

	// do it later
}