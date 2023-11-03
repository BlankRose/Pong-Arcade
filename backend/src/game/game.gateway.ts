import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { OnModuleInit } from "@nestjs/common";
import { Server, ServerOptions } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: 'localhost:3001'
	}
})
export class GameGateway {

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log("connected");
		})
	}

	@SubscribeMessage('newmessage')
	onNewmessage(@MessageBody() body: any)
	{
		console.log(body);
	}
}

export default GameGateway;

