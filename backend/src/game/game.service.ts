import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "./entities/game.entity";
import {Repository} from "typeorm";
import {GameConstants, GameState, PlayerState, UserSocket} from "./entities/gamestate.entity";
import {AuthGuard} from "src/auth/jwt/jwt.strategy";
import {Server} from "socket.io";
import {UsersService} from "src/users/users.service";
import {UserStatus} from "../users/user.entity";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		private readonly userService: UsersService,
		private authGuard: AuthGuard,
	) {}

	private activeGames: GameState[] = [];

	private sanitizeGameState(game: GameState): GameState {
		const sanitized = {...game};
		delete sanitized.player1_socket;
		delete sanitized.player2_socket;
		delete sanitized.player1_pressUp;
		delete sanitized.player2_pressUp;
		delete sanitized.player1_pressDown;
		delete sanitized.player2_pressDown;
		return sanitized;
	}

	scoringInspector(game: GameState): GameState {
		if (game.ballX >= GameConstants.LEFT
				&& game.ballVelX >= 0) {
			game.score1 += 1;
			game.ballVelX = -2;
		}
		else if (game.ballX <= GameConstants.RIGHT
			&& game.ballVelX <= 0) {
			game.score2 += 1;
			game.ballVelX = 2;
		}
		game.ballVelY = 0;
		game.ballX = 0;
		game.ballY = 0;
		game.paddle1 = 0;
		game.paddle2 = 0;
		return game;
	}

	updateGames(server: Server) {
		for (let game of this.activeGames) {
			let playSound = false;
			// Scoring Detect
			if ((game.ballX >= GameConstants.LEFT && game.ballVelX >= 0)
				|| (game.ballX <= GameConstants.RIGHT && game.ballVelX <= 0))
				game = this.scoringInspector(game);

			// Ending Trigger
			if ((game.score1 > 10 || game.score2 > 10)
				&& (Math.abs(game.score1 - game.score2) >= 2))
			{
				void this.endGame(server, game);
				continue;
			}

			// Movements PADDLE
			if (game.player1_pressDown)
				game.paddle1 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 += 3 : game.paddle1;
			if (game.player1_pressUp)
				game.paddle1 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 -= 3 : game.paddle1;

			if (game.player2_pressDown)
				game.paddle2 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 += 3 : game.paddle2;
			if (game.player2_pressUp)
				game.paddle2 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 -= 3 : game.paddle2;

			// Ball Movements
			game.ballX += game.ballVelX;
			game.ballY += game.ballVelY;

			// Walls Collisions
			if ((game.ballY + (GameConstants.BALL_RADIUS / 2) >= GameConstants.TOP && game.ballVelY >= 0)
				|| (game.ballY - (GameConstants.BALL_RADIUS / 2) <= GameConstants.BOTTOM && game.ballVelY <= 0)) {
				game.ballVelY = -game.ballVelY;
				playSound = true;
			}

			// Paddles Collisions
			if ((game.ballX + (GameConstants.BALL_RADIUS / 2) >= GameConstants.LEFT - GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle2 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle2 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX >= 0)
				|| ( game.ballX - (GameConstants.BALL_RADIUS / 2) <= GameConstants.RIGHT + GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle1 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle1 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX <= 0)) {
				game.ballVelX = (-game.ballVelX) * 1.1;
				game.ballVelY = (Math.random() - 0.5) * 8;
				playSound = true;
			}

			// Sends Update
			const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
			const sanitizedGame = this.sanitizeGameState(game);
			server.to(room_name).emit('gameUpdate', { ...sanitizedGame, playSound: playSound});
		}
	}

	generateCode(): string {
		const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const charlen = charset.length;

		let code = "";
		for (let i = 0; i < 12; i++)
			code += charset.charAt(Math.floor(Math.random() * charlen));
		return code;
	}

	async connect(client: UserSocket) {
		const token = client.handshake.auth.token;
		if (!token) {
			console.log('Client disconnected: No token provided');
			client.disconnect(true);
			return;
		}

		const user = await this.authGuard.validateToken(token);
		if (!user) {
			console.log('Client disconnected: Invalid token');
			client.disconnect(true);
			return;
		}

		client.data.state = PlayerState.NONE;
		client.data.game = undefined;
		client.data.user = user.id;

		if (await this.userService.sessionStatus(user.id) != UserStatus.Playing)
			void this.userService.toggleStatus(user.id, UserStatus.Online);
		console.log('New client connected', client.data);
	}

	disconnect(server: Server, client: UserSocket) {
		this.abondonGame(server, client);
		if (client?.data?.user)
			void this.userService.toggleStatus(client.data.user, UserStatus.Offline);
		console.log('Client disconnected');
	}

	startGame(server: Server, players: UserSocket[]) {
		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		const game: GameState = {
			paddle1: 0, paddle2: 0,
			ballX: 0, ballY: 0,
			ballVelX: 2, ballVelY: 0,
			score1: 0, score2: 0,

			player1: players[0].data.user,
			player1_socket: players[0].id,
			player1_pressUp: false,
			player1_pressDown: false,

			player2_socket: players[1].id,
			player2_pressUp: false,
			player2_pressDown: false,
			player2: players[1].data.user,
		};

		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);
		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].rooms.forEach(value => players[i].leave(value));
			players[i].join(room_name);
			players[i].emit('gameStart', sanitizedGame);
			void this.userService.toggleStatus(players[i].data.user, UserStatus.Playing);
		}
	}

	async endGame(server: Server, game: GameState) {
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

		//Update des stats de chaque user ************

		if (game.player1 != game.player2) {
			let game_entry = new Game();
			game_entry.playerOne = await this.userService.findOneByID(game.player1);
			game_entry.playerTwo = await this.userService.findOneByID(game.player2);
			game_entry.scorePlayerOne = game.score1;
			game_entry.scorePlayerTwo = game.score2;
			game_entry.playedOn = new Date(Date.now());

			const winner = this.userService.quickFix(Math.max(game.score1, game.score2) === game.score1 ? game_entry.playerOne : game_entry.playerTwo);
			const loser = this.userService.quickFix(Math.min(game.score1, game.score2) === game.score1 ? game_entry.playerOne : game_entry.playerTwo);
			const scoreDiff = Math.max(game.score1, game.score2) - Math.min(game.score1, game.score2);

			winner.win += 1;
			loser.lose += 1;
			winner.streak = winner.lose === 0 ? winner.win : (winner.win / winner.lose);
			loser.streak = loser.lose === 0 ? loser.win : (loser.win / loser.lose);
			winner.xp += 50 + scoreDiff * 2;
			loser.xp += 21 - scoreDiff;
			if (winner.xp >= winner.rank * 100 && winner.rank < 98)
			{
				winner.rank += 1;
				winner.xp = 0;
			}
			if (loser.xp >= loser.rank * 100  && loser.rank < 98)
			{
				loser.rank += 1;
				loser.xp = 0;
			}

			winner.elo +=  100;
			loser.elo -= (loser.elo < 0 ? 0: 25);

			void this.userService.updateUser(winner.id, winner);
			void this.userService.updateUser(loser.id, loser);

			void this.gameRepository.save(game_entry);
		}

		server.to(room_name).emit('gameEnd', {
			winner: sockets.get(winner)?.data.user,
			game: this.sanitizeGameState(game)
		});

		void this.userService.toggleStatus(game.player1, UserStatus.Online);
		void this.userService.toggleStatus(game.player2, UserStatus.Online);
		this.activeGames.splice(this.activeGames.indexOf(game), 1);
	}

	queueStart(server: Server) {
		const room_name = 'queue';
		const room = server.sockets.adapter.rooms.get(room_name);
		if (!room || room.size < 2)
			return;

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined];

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;

			target.leave(room_name);
			players[i] = target;
		}
		this.startGame(server, players);
	}

	privateStart(server: Server, code: string) {
		const room_name = 'priv_' + code;
		const room = server.sockets.adapter.rooms.get(room_name);
		if (!room || room.size < 2)
			return;

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined];
		const size = room.size;

		for (let i = 0; i < size; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			if (i < 2) {
				target.data.state = PlayerState.PLAYING;
				target.data.game = this.activeGames.length;
				players[i] = target;
				target.leave(room_name);
			} else {
				this.leaveQueue(target);
				target.emit('privateKicked', code);
			}
		}
		this.startGame(server, players);
	}

	joinQueue(client: UserSocket, server: Server): boolean {
		if (client.data.state != PlayerState.NONE)
			return false;

		client.data.state = PlayerState.WAITING;
		client.join('queue');
		this.queueStart(server);
		return true;
	}

	newPrivate(client: UserSocket): string {
		if (client.data.state != PlayerState.NONE)
			return null;

		const new_code = this.generateCode();
		client.data.state = PlayerState.WAITING;
		client.join('priv_' + new_code);
		return new_code;
	}

	joinPrivate(client: UserSocket, server: Server, code: string): boolean {
		if (client.data.state != PlayerState.NONE)
			return false;

		client.data.state = PlayerState.WAITING;
		client.join('priv_' + code);
		this.privateStart(server, code);
		return true;
	}

	leaveQueue(client: UserSocket): boolean {
		if (client.data.state != PlayerState.WAITING)
			return false;

		client.data.state = PlayerState.NONE;
		client.rooms.forEach(value => {
			client.leave(value);
		});
		return true;
	}

	abondonGame(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				void this.endGame(server, game);
				break;
			}

			if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				void this.endGame(server, game);
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

	quickMovePaddle(client: UserSocket, height: number) {
		if (client.data.state != PlayerState.PLAYING)
			return;
		const game = this.activeGames[client.data.game];

		if (height >= GameConstants.TOP - GameConstants.PADDLE_HEIGHT / 2)
			height = GameConstants.TOP - GameConstants.PADDLE_HEIGHT / 2;
		if (height <= GameConstants.BOTTOM + GameConstants.PADDLE_HEIGHT / 2)
			height = GameConstants.BOTTOM + GameConstants.PADDLE_HEIGHT / 2;

		if (game.player1_socket == client.id) {
			game.paddle1 = height;
		} else {
			game.paddle2 = height;
		}
	}
}