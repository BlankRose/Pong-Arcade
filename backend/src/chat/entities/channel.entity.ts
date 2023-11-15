import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToMany, JoinTable, } from "typeorm";
import ChannelMessage from "./channelMessage.entity";
import { User } from "src/users/user.entity";


@Entity()
export class Channel {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.ownedChannels)
    @JoinColumn({ name: 'ownedChannels' })
    owner: User

	@Column({
		type: 'text',
		default: 'room',
	  })
	name: string;

	@Column({
		type: 'text',
		default: 'public'
	})
	type: string;

	@Column({
		type: 'boolean',
		default: false,
	  })
	  isProtected: boolean;

	@Column({
		type: 'text',
		nullable: true,
	  })
	password: string;

	@CreateDateColumn()
    creationDate: Date
	

	@ManyToMany(() => User, user => user.adminInChannels, {
		onDelete: 'CASCADE',
	  })
	  @JoinTable()
	  admins: User[];


	@ManyToMany(() => User, user => user.bannedInChannels, {
	onDelete: 'CASCADE',
	 })
	 @JoinTable()
	 bannedUsers: User[];

	@ManyToMany(() => User, user => user.mutedInChannels, {
	onDelete: 'CASCADE',
	 })
	 @JoinTable()
	 mutedUsers: User[];


	@ManyToMany(() => User, user => user.joinedChannels)
	members: User[];

	@OneToMany(() => ChannelMessage, message => message.channelId)
	@JoinColumn({name: 'messages'})
	messages: ChannelMessage[];

}

