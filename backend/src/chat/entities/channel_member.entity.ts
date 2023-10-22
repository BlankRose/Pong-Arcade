import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Channel from "./channel.entity";
import { User } from "src/users/user.entity";

@Entity()
class ChannelMember {

	@PrimaryColumn()
	id: number;

	@ManyToOne(() => Channel, channel => channel.members)
	channel: Channel;

	@ManyToOne(() => User, user => user.channels)
	user: User;

	@Column({ default: false })
	isAdmin: boolean;

	@Column({ default: false })
	isMuted: boolean;

	@Column({ default: false })
	isBanned: boolean;

}

export default ChannelMember;
