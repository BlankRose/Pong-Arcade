import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, ServerOptions } from "socket.io";

@WebSocketGateway(<ServerOptions>{
	path: '/game',
	connectTimeout: 10000,
})
class GameGateway
	implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	clients: any[] = [];

	handleConnection(client: any, ...args: any[]) {
		console.log('New client connected');
	}

	handleDisconnect(client: any) {
		console.log('Client disconnected');
	}
};

export default GameGateway;
