import {
	OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
	SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse
} from "@nestjs/websockets";
import { UserSocket } from "./entities/gamestate.entity";
import { Server, ServerOptions } from "socket.io";
import { GameService } from "./game.service";

@WebSocketGateway(<ServerOptions>{
	path: '/game',
	connectTimeout: 10000,
})
class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;

	gameThread: NodeJS.Timeout

	afterInit(server: Server) {
		this.gameThread = setInterval(() => this.gameService.updateGames(server), 1000/10);
	}

	handleConnection(client: UserSocket, ...args: any[]) {
		this.gameService.connect(client);
	}

	handleDisconnect(client: UserSocket) {
		this.gameService.disconnect(this.server, client);
	}

	@SubscribeMessage('joinQueue')
	joinQueue(client: UserSocket, data: string): WsResponse {
		const success = this.gameService.joinQueue(client, this.server);
		return success
			? { event: 'joinQueueSuccess', data: '' }
			: { event: 'joinQueueError', data: '' };
	}

	@SubscribeMessage('leaveQueue')
	leaveQueue(client: UserSocket, data: string): WsResponse {
		const success = this.gameService.leaveQueue(client);
		return success
			? { event: 'leaveQueueSuccess', data: '' }
			: { event: 'leaveQueueError', data: '' };
	}
};

export default GameGateway;
