import {User} from 'src/users/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
} from 'typeorm';

@Entity()
export class Game {

    /* **************** */
    /* Game information */
    /* **************** */

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    playerOne: User;

    @ManyToOne(() => User)
    playerTwo: User;

    @Column()
    scorePlayerOne: number;

    @Column()
    scorePlayerTwo: number;

    @Column()
    playedOn: Date;
}
