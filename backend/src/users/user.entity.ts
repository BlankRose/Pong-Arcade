// src/users/user.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne,
  } from 'typeorm';
  import { Message } from '../messages/messages.entity';
  import { Channel } from '../channels/channels.entity';

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

	@Column({default: -1})
	id42: number;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({default: 0})
	win: number;

	@Column({default: 0})
	lose: number;

	@Column({default: 0})
	streak: number;

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
