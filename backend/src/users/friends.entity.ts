import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'
import { UserStatus } from 'src/users/user.entity'

@Entity()
class Friend
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    avatar: string; 

    @Column()
    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.Offline,
    })
    status: UserStatus;
}