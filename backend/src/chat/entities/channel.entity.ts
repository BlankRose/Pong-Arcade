import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToMany, JoinTable, } from "typeorm";
import Message from "./message.entity";
import { User } from "src/users/user.entity";


@Entity()
class Channel {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.ownedChannels)
    @JoinColumn({ name: 'ownedChannels' })
    owner: User

	@ManyToMany(() => User, user => user.channelAdmins, {
		onDelete: 'CASCADE',
	  })
	  @JoinTable()
	  admins: User[];


	@ManyToMany(() => User, user => user.bannedChannels, {
	onDelete: 'CASCADE',
	 })
	 @JoinTable()
	 bannedUsers: User[];

	@ManyToMany(() => User, user => user.mutedChannels, {
	onDelete: 'CASCADE',
	 })
	 @JoinTable()
	 mutedUsers: User[];

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

	@OneToMany(() => User, user => user.channels)
	members: User[];

	@OneToMany(() => Message, message => message.channel)
	messages: Message[];

}

export default Channel;
