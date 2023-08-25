// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

	/* ********************** */
	/* Account Authentication */
	/* ********************** */

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

	@Column({default: -1})
	id42: number;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({default: 0})
	win: number;

	@Column({default: 0})
	lose: number;

	@Column({default: 0})
	streak: number;
}
