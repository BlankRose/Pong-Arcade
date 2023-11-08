import { Socket } from "socket.io"

export enum PlayerState {
	NONE,
	WAITING,
	PLAYING,
}

export class UserSocket extends Socket {
	data: {
		state: PlayerState
		user: number
		game: number | undefined
	}
}

export const GameConstants = {
	TOP: 50,
	BOTTOM: -50,
	LEFT: 100,
	RIGHT: -100,
}

export class GameState {
	paddle1: number
	paddle2: number

	ballX: number
	ballY: number

	score1: number
	score2: number

	player1: string
	player2: string
}
