import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, 
	SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { OnModuleInit } from "@nestjs/common";
import { Server, ServerOptions } from "socket.io";
import { UsersService } from "src/users/users.service";


@WebSocketGateway(
	{
		cors: {
			origin: ['http://localhost:5500'],
			path: '/game',
		}
	}
)
class GameGateway
	 {

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connect', (socket) => {
			console.log(`socket_id: ${socket.id}`);
			console.log('connected');
		})
	}

	//clients: any[] = [];

	@SubscribeMessage('test')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('testMessage', {
			msg: 'New Message',
			content: body,			
		});
	}

	@SubscribeMessage('disconnect')
	handleDisconnect(client: any) {
		console.log('Client is disconnected');
	}
};

export default GameGateway;
