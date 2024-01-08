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
	LEFT: 100,   // ==>
	RIGHT: -100, // <==

	PADDLE_WIDTH: 3,
	PADDLE_HEIGHT: 20,
	BALL_RADIUS: 8
}

export class GameState {
	paddle1: number
	paddle2: number

	ballX: number
	ballY: number
	ballVelX: number
	ballVelY: number
	
	player1: number
	player2: number
	score1: number
	score2: number

	player1_pressUp: boolean
	player1_pressDown: boolean
	player2_pressUp: boolean
	player2_pressDown: boolean

	player1_socket: string
	player2_socket: string
}