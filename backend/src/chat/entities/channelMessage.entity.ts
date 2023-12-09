import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import {Channel} from "./channel.entity";
import { User } from "src/users/user.entity"

@Entity()
class ChannelMessage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@Column({ default: -1 })
    senderId: number
	
	@CreateDateColumn()
    creationDate: Date;

	@Column({ default: 'defaultNickname' })
    username: string;



    @ManyToOne(() => Channel, (channel) => channel.messages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'channelId' })
    channelId: number;


}

export default ChannelMessage;
