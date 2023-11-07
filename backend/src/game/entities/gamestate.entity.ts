import { Socket } from "socket.io"

export enum PlayerState {
	NONE,
	WAITING,
	READY,
	PLAYING,
}

export class UserSocket extends Socket {
	data: {
		state: PlayerState
		user: number
		game: number | undefined
	}
}

export class GameState {
	paddle1: number
	paddle2: number

	ballX: number
	ballY: number

	score1: number
	score2: number
}
