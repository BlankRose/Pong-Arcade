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

	startGame(server: Server) {
		const room = server.sockets.adapter.rooms.get('queue');
		if (room.size < 2)
			return;

		const game: GameState = {
			paddle1: 0,
			paddle2: 0,
			ballX: 0,
			ballY: 0,
			score1: 0,
			score2: 0,
		};

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room[i]) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;
			target.leave('queue');
		}

		// TODO: Start a new game instance
		// this.activeGames.push(game);
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
