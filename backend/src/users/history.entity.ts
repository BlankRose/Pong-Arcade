import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class History
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	player1: string;

	@Column()
	player2: string;

	@Column()
	player1_score: number;

	@Column()
	player2_score: number;

	@Column()
	played_at: Date;
}
