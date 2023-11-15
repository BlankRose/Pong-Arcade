import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { NewChannelDto } from "./dto/create-channel.dto";
import { NewMessageDto } from "./dto/create-message.dto";
import { ChatService} from "./chat.service";
import { User } from "src/users/user.entity";

@WebSocketGateway({namespace: 'chat', cors: {origine: '*'}, connectTimeout: 10000})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService,) {}


	@WebSocketServer()
	server: Server;

	gameThread: NodeJS.Timeout

	afterInit(server: Server) {
		console.log("Chat socket is lunched")
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Socket connected, client: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		console.log(`Socket disconnected, client: ${client.id}`)
	}

	@SubscribeMessage('SubmitMsg')
	async submitMsg(@MessageBody() newMessage: NewMessageDto ) {
		try {
            console.log("newMsg: ", newMessage)
			await this.chatService.createMessage(newMessage)
			const allChannelMsg = await this.chatService.findChannelMessages(newMessage.channelId)
			this.server.emit('incomingMessages', allChannelMsg)
		} catch (error) {
			console.log("Error in adding new msg. Error: ", error)
		}
	}

    @SubscribeMessage('ReturnChannelMsg')
    async ReturnMsgs(@MessageBody() channelId: number) {
        try {
            const allMsgs = await this.chatService.ReturnAllMsg(channelId)
            return allMsgs
        } catch (error) {
            console.log('Error in fetchin channel messages. Error: ', error)
        }
    }

	@SubscribeMessage('createNewChannel')
    async createChannel(@MessageBody() newChannel: NewChannelDto) {
        try {
            console.log("sent data: ", newChannel)
            const newCreatedchannel = await this.chatService.createChannel(
                newChannel
            )
            this.server.emit('newChannel', newCreatedchannel)
            return newCreatedchannel.id
        } catch (error) {
            console.log('Error in channel creation. Error: ', error)
        }
    }

	@SubscribeMessage('ReturnChannelMembers')
	async returnChannelmembers (@MessageBody() channelId: number) {
		try {
			await await this.chatService.findChannelMembers(channelId)
		} catch (error) {
			console.log ("Error in fetching channel members")
		}
	}

	@SubscribeMessage('ReturnChannels')
	async returnChannels () {
		try {
            console.log("i'm in Return Channels")
			return await this.chatService.getChannels()
		} catch (error) {
			console.log ("Error in fetching channel list. Error: ", error)
		}
	}

	@SubscribeMessage('joinChannel')
    async joinChannel(@MessageBody() data) {
        console.log("received data: ", data)
        const [channelId, userId, password] = data
        try {
            return await this.chatService.addUserToChannel (
                channelId,
                userId,
                password
            )
        } catch (error) {
            console.log('Error in joining channel. Error: ', error)
        }
    }

	@SubscribeMessage('RemoveUserFromChannel')
    async removeUser(@MessageBody() channelId: number, user: User) {
        try {
            return await this.chatService.removeUserFromChannel (channelId, user)
        } catch (error) {
            console.log('Error in removing user from the channel ')
        }
    }
    @SubscribeMessage('RemoveChannel')
    async removeChannel(@MessageBody() data: any) {
        try {
            const [channelId, userId] = data;
            return await this.chatService.deleteChannel(channelId, userId)
        } catch (error) {
            console.log('Failed to delete the channel. Error: ', error)
        }
    }

    @SubscribeMessage('changePassword')
    async changeChannelPassword(@MessageBody() channelId, password: string) {
        try {
            return await this.chatService.changePassword(channelId, password)
        } catch (error) {
            console.log('Failed to change password')
        }
    }
}