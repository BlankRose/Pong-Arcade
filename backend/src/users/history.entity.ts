import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class History
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	player1: number;

	@Column()
	player2: number;

	@Column()
	player1_score: number;

	@Column()
	player2_score: number;

	@Column()
	played_at: Date;
}
