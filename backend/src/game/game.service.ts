import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Repository } from "typeorm";
import { GameState, PlayerState, UserSocket } from "./entities/gamestate.entity";
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

	private sanitizeGameState(game: GameState): GameState {
		const sanitized = {...game};
		delete sanitized.player1;
		delete sanitized.player2;
		return sanitized;
	}

	updateGames(server: Server) {
		for (const game of this.activeGames) {
			// TODO: Game logic here

			if ((game.score1 > 10 || game.score2 > 10)
				&& (Math.abs(game.score1 - game.score2) >= 2))
			{
				this.endGame(server, game);
				continue;
			}

			const room_name = 'game_' + game.player1 + '_' + game.player2;
			const sanitizedGame = this.sanitizeGameState(game);
			server.to(room_name).emit('gameUpdate', sanitizedGame);
		}
	}

	async connect(client: UserSocket) {
		const token = client.handshake.auth.token;
		if (!token)
			throw new UnauthorizedException();

		const user = this.authGuard.validateToken(token);
		client.data.state = PlayerState.NONE;
		client.data.game = undefined;
		client.data.user = (await user).id;

		console.log('New client connected', client.data);
	}

	async disconnect(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1 == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}

			if (game.player2 == client.id) {
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
			player1: players[0].id,
			player2: players[1].id,
		};

		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);
		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);
			players[i].emit('gameStart', { opponent: players[i ? 0 : 1].data.user, game: sanitizedGame });
		}
	}

	endGame(server: Server, game: GameState) {
		const room_name = 'game_' + game.player1 + '_' + game.player2;
		const winner = game.score1 > game.score2 ? game.player1 : game.player2;
		const sockets = server.sockets.sockets;

		try {
			sockets.get(game.player1).data.state = PlayerState.NONE;
			sockets.get(game.player1).data.game = undefined;
		} catch {
			console.log('End of game: Player 1 has disconnected');
		}
		try {
			sockets.get(game.player2).data.state = PlayerState.NONE;
			sockets.get(game.player2).data.game = undefined;
		} catch {
			console.log('End of game: Player 2 has disconnected');
		}

		server.to(room_name).emit('gameEnd', {
			winner: sockets.get(winner)?.data.user,
			game: this.sanitizeGameState(game)
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

}
