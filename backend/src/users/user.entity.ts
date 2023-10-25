// src/users/user.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne,
	JoinColumn,
  } from 'typeorm';
  import { Message } from '../messages/messages.entity';
  import { Channel } from '../channels/channels.entity';



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
        default: UserStatus.Online,
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

	@OneToMany(() => Message, (message) => message.user)
  	messages: Message[];

  	@OneToMany(() => Channel, (channel) => channel.owner)
  	ownedChannels: Channel[];

  	@ManyToMany(() => Channel)
  	@JoinTable()
  	channels: Channel[];

  	@ManyToMany(() => User)
  	@JoinTable()
  	blockedUsers: User[];
}
