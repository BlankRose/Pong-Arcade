import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm'
import { JoinColumn } from 'typeorm'
import { Channel } from './channel.entity'
import { User } from "src/users/user.entity"

@Entity()
export class MutedUserChannel {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Channel, (channel) => channel.mutedMembers, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'channelId' })
    channel: Channel

    @ManyToOne(() => User, (user) => user.mutedInChannel, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    mutedUser: User

    @CreateDateColumn()
    mutedAt: Date
}
