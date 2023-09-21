import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';

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

	@Column({ default: -1 })
	id42: number;

	@Column({ default: null })
	token2FA: string;

	/* ********************** */
	/*   Account Information  */
	/* ********************** */

	@Column({ default: null })
	avatar: string;

	@ManyToMany(() => User)
	@JoinColumn()
	friends: User[];

	@ManyToOne(() => User)
	@JoinColumn()
	friendRequest: User;

	@ManyToMany(() => User)
	@JoinColumn()
	blocked: User[];

	/* ********************** */
	/*   Account Statistics   */
	/* ********************** */

	@Column({ default: 0 })
	win: number;

	@Column({ default: 0 })
	lose: number;

	@Column({ default: 0 })
	streak: number;

	@Column({ default: 0 })
	rank: number;

}
