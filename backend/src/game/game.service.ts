import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Repository } from "typeorm";
import { GameConstants, GameState, PlayerState, UserSocket } from "./entities/gamestate.entity";
import { AuthGuard } from "src/auth/jwt/jwt.strategy";
import { Server } from "socket.io";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		private authGuard: AuthGuard,
	) {}

	private activeGames: GameState[] = [];

	private sanitizeGameState(server: Server, game: GameState): GameState {
		const sanitized = {...game};
		delete sanitized.player1_socket;
		delete sanitized.player2_socket;
		delete sanitized.player1_pressUp;
		delete sanitized.player2_pressUp;
		delete sanitized.player1_pressDown;
		delete sanitized.player2_pressDown;
		return sanitized;
	}

	updateGames(server: Server) {
		for (let game of this.activeGames) {
			// TODO: Game logic here
			Math.random() > 0.9 ? game.score1 += 1 : game.score1;
			Math.random() < 0.1 ? game.score2 += 1 : game.score2;

			if (game.player1_pressDown)
				game.paddle1 < GameConstants.TOP ? game.paddle1 += 1 : game.paddle1;
			if (game.player1_pressUp)
				game.paddle1 > GameConstants.BOTTOM ? game.paddle1 -= 1 : game.paddle1;

			if (game.player2_pressDown)
				game.paddle2 < GameConstants.TOP ? game.paddle2 += 1 : game.paddle2;
			if (game.player2_pressUp)
				game.paddle2 > GameConstants.BOTTOM ? game.paddle2 -= 1 : game.paddle2;

			if ((game.score1 > 10 || game.score2 > 10)
				&& (Math.abs(game.score1 - game.score2) >= 2))
			{
				this.endGame(server, game);
				continue;
			}

			const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
			const sanitizedGame = this.sanitizeGameState(server, game);
			server.to(room_name).emit('gameUpdate', sanitizedGame);
		}
	}

	async connect(client: UserSocket) {
		const token = client.handshake.auth.token;
		if (!token) {
			console.log('Client disconnected: No token provided');
			client.disconnect(true);
			return;
		}

		const user = this.authGuard.validateToken(token);
		if (!user) {
			console.log('Client disconnected: Invalid token');
			client.disconnect(true);
			return;
		}

		client.data.state = PlayerState.NONE;
		client.data.game = undefined;
		client.data.user = (await user).id;

		console.log('New client connected', client.data);
	}

	async disconnect(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}

			if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}

		console.log('Client disconnected');
	}

	startGame(server: Server) {
		const room = server.sockets.adapter.rooms.get('queue');
		if (room.size < 2)
			return;

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined]

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;

			target.leave('queue');
			players[i] = target;
		}

		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		const game: GameState = {
			paddle1: 0,
			paddle2: 0,
			ballX: 0,
			ballY: 0,
			score1: 0,
			score2: 0,
			player1_socket: players[0].id,
			player2_socket: players[1].id,
			player1_pressUp: false,
			player1_pressDown: false,
			player2_pressUp: false,
			player2_pressDown: false,
			player1: players[0].data.user,
			player2: players[1].data.user,
		};

		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(server, game);
		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);
			players[i].emit('gameStart', sanitizedGame);
		}
	}

	endGame(server: Server, game: GameState) {
		const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
		const winner = game.score1 > game.score2 ? game.player1_socket : game.player2_socket;
		const sockets = server.sockets.sockets;

		try {
			sockets.get(game.player1_socket).data.state = PlayerState.NONE;
			sockets.get(game.player1_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 1 has disconnected');
		}
		try {
			sockets.get(game.player2_socket).data.state = PlayerState.NONE;
			sockets.get(game.player2_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 2 has disconnected');
		}

		server.to(room_name).emit('gameEnd', {
			winner: sockets.get(winner)?.data.user,
			game: this.sanitizeGameState(server, game)
		});

		this.activeGames.splice(this.activeGames.indexOf(game), 1);
	}

	joinQueue(client: UserSocket, server: Server): boolean {
		if (client.data.state != PlayerState.NONE)
			return false;

		client.data.state = PlayerState.WAITING;
		client.join('queue');
		this.startGame(server);
		return true;
	}

	leaveQueue(client: UserSocket): boolean {
		if (client.data.state != PlayerState.WAITING)
			return false;

		client.data.state = PlayerState.NONE;
		client.leave('queue');
		return true;
	}

	abondonGame(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}

			if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}
	}

	shiftDirection(client: UserSocket, isUp: boolean, press: boolean) {
		if (client.data.state != PlayerState.PLAYING)
			return;
		const game = this.activeGames[client.data.game];

		if (game.player1_socket == client.id) {
			if (isUp)
				game.player1_pressUp = press;
			else
				game.player1_pressDown = press;
		}

		else if (game.player2_socket == client.id) {
			if (isUp)
				game.player2_pressUp = press;
			else
				game.player2_pressDown = press;
		}
	}
}
