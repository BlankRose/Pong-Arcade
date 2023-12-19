import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import {User} from '../users/user.entity'

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.friends)
    user: User

    @ManyToOne(() => User, (user) => user.FriendsInvitedBy)
    friend: User

    @Column()
    isPending: boolean

    @ManyToOne(() => User, (user) => user.friendsAdded)
    createdBy: User
}
