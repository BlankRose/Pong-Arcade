import { UnauthorizedException } from "@nestjs/common";
import {
	OnGatewayConnection, OnGatewayDisconnect,
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
	implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: UserSocket, ...args: any[]) {
		this.gameService.connect(client);
	}

	handleDisconnect(client: UserSocket) {
		console.log('Client disconnected');
	}

	@SubscribeMessage('test')
	test(client: UserSocket, data: string): WsResponse {
		console.log("Test event triggered by client", client.data, "with data", data);
		return { event: 'done', data: 'This is a test!~' };
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
