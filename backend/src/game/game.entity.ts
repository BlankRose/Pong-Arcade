import {User} from 'src/users/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column
} from 'typeorm';

@Entity()
export class Game {

    /* **************** */
    /* Game information */
    /* **************** */

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playerOne: User[];

    @Column()
    playerTwo: User[];

    @Column()
    scorePlayerOne: number;

    @Column()
    scorePlayerTwo: number;

    @Column()
    winner: string;
    
    @Column()
    loser: string;

    @Column()
    nbPlayers: number;
}

