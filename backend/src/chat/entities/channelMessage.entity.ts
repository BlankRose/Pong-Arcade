import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import {Channel} from "./channel.entity";
import { User } from "src/users/user.entity";

@Entity()
class ChannelMessage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;
	
	@CreateDateColumn()
    creationDate: Date;

	@Column({ type: 'text' })
    userNickname: string;

	@ManyToOne(() => User, user => user.channelMessages, {onDelete: 'CASCADE'})
	sender: User;

    @ManyToOne(() => Channel, (channel) => channel.messages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'channelId' })
    channelId: number;


}

export default ChannelMessage;
