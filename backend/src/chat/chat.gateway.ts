import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { NewChannelDto } from "./dto/create-channel.dto";
import { NewMessageDto } from "./dto/create-message.dto";
import { ChatService} from "./chat.service";
import { User } from "src/users/user.entity";

@WebSocketGateway({namespace: 'chat', cors: true, connectTimeout: 10000})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService,) {}


	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		console.log("Chat socket is lunched")
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Socket connected, client: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		console.log(`Socket disconnected, client: ${client.id}`)
	}

	@SubscribeMessage('HandleNewMessage')
	async HandleNewMessage(@MessageBody() newMessage: NewMessageDto ) {
		try {
			await this.chatService.createMessage(newMessage)
			const allChannelMsg = await this.chatService.findChannelMessages(newMessage.channelId)
			this.server.emit('newMessage', allChannelMsg, newMessage.channelId)


		} catch (error) {
			console.log("Error in adding new msg. Error: ", error)
		}
	}

    @SubscribeMessage('ReturnChannelMsg')
    async FetchChannelMessages(@MessageBody() channelId: number) {
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
            const newCreatedchannel = await this.chatService.createChannel(
                newChannel
            )
            this.server.emit('newChannel', newCreatedchannel)
            return newCreatedchannel.id
        } catch (error) {
            console.log('Error in channel creation. Error: ', error)
        }
    }

	@SubscribeMessage('FetchChannelMembers')
	async FetchChannelMembers (@MessageBody() channelId: number) {
		try {
		   return await this.chatService.findChannelMembers(channelId)
		} catch (error) {
			console.log ("Error in fetching channel members")
		}
	}

	@SubscribeMessage('FetchChannels')
	async FetchChannels () {
		try {
			return await this.chatService.getChannels()
		} catch (error) {
			console.log ("Error in fetching channel list. Error: ", error)
		}
	}

	@SubscribeMessage('joinChannel')
    async joinChannel(@MessageBody() data) {
        const [channelId, userId, password] = data
        try {
            await this.chatService.addUserToChannel (
                channelId,
                userId,
                password
            )
            this.server.emit("UpdateChatPageNoReset")
        } catch (error) {
            console.log('Error in joining channel. Error: ', error)
        }
    }

	@SubscribeMessage('RemoveUserFromChannel')
    async removeUser(@MessageBody() data) {
        try {
            const [channelId, userId] = data
            await this.chatService.removeUserFromChannel (channelId, userId)
            this.server.emit("UpdateChatPage")
        } catch (error) {
            console.log('Error in removing user from the channel, Error: ', error)
        }
    }
    @SubscribeMessage('RemoveChannel')
    async removeChannel(@MessageBody() data: any) {
        try {
            const [channelId, userId] = data;
            await this.chatService.deleteChannel(channelId, userId)
            this.server.emit("UpdateChatPage")
        } catch (error) {
            console.log('Failed to delete the channel. Error: ', error)
        }
    }

    @SubscribeMessage('changeChannelPassword')
    async changeChannelPassword(@MessageBody() data) {
        const [channelId, password] = data
        try {
            return await this.chatService.changeChannelPassword(channelId, password)
        } catch (error) {
            console.log('Failed to change password')
        }
    }


    @SubscribeMessage('createDM')
    // @UsePipes(ValidationPipe)
    async createDirectChannel(@MessageBody() [userId, otherUserId]: [number, number]) {
        const channel = await this.chatService.createDirectMsgChannel(userId, otherUserId)
        this.server.emit('newChannel', channel)
        return channel
    }

    @SubscribeMessage('blockMember')
    async blockUserHandler(@MessageBody() [blockerId, toBlockId]: [number, number]) {
      try {
          await this.chatService.blockMember(blockerId, toBlockId);
          this.server.emit('UpdateChatPage')
      } catch (error) {
          console.error(`Failed to block user with blockerUserId: ${blockerId} and toBlockUserId: ${toBlockId}`);
      }
   }

   @SubscribeMessage('unblockMember')
    async unblockUserHanlder(@MessageBody() [blockerId, toUnblockId]: [number, number]) {
        try {
            this.chatService.unblockMember(blockerId, toUnblockId)
            this.server.emit('UpdateChatPage')
        } catch (error) {
            console.log(`Failed to unblock user with blockerUserId: ${blockerId} and toBlockUserId: ${toUnblockId}`)
        }
    }

    @SubscribeMessage('getBlockedUsers')
    async getBlockedUsers(@MessageBody() myId: number) {
        try {
            return await this.chatService.fetchBlockedMembers(myId)
        } catch (error) {
            console.log('Failed to get blocked users', error)
        }
    }

    @SubscribeMessage('setAdmin')
    async setAdmin(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            await this.chatService.setAsAdmin(userId, targetId, channelId)
            this.server.emit('UpdateChatPage')
            return { message: 'User is now admin' }
        } catch (error) {
            console.log('Failed to set admin')
        }
    }

    @SubscribeMessage('unsetAdmin')
    async unsetAdmin(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            this.chatService.unsetAdmin(userId, targetId, channelId)
            this.server.emit('UpdateChatPage')
            return { message: 'User it is no longer admin' }
        } catch (error) {
            console.log('Failed to unset admin')
        }
    }

    @SubscribeMessage('kickUser')
    async kickUser(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            this.chatService.kickMember(userId, targetId, channelId)
            this.server.emit("UpdateChatPage")
            return { message: 'User kicked successfully' }
        } catch (error) {
            console.log('Failed to kick user')
        }
    }

    @SubscribeMessage('banUser')
    async banUser(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            console.log("I'm in ban backend")
            this.chatService.banMember(userId, targetId, channelId)
            this.server.emit("UpdateChatPage")
            return { message: 'User banned successfully' }
        } catch (error) {
            console.log('Failed to ban user')
        }
    }

    @SubscribeMessage('unbanUser')
    async unbanUser(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            this.chatService.unbanMember(userId, targetId, channelId)
            this.server.emit('UpdateChatPage')
            return { message: 'User unbanned successfully' }
        } catch (error) {
            console.log('Failed to unban user')
        }
    }

    @SubscribeMessage('getBannedUsers')
    async getBannedUsers(@MessageBody() channelId: number) {
        try {
            return await this.chatService.getBannedMembers(channelId)
        } catch (error) {
            console.log('Failed to get banned users')
        }
    }

    @SubscribeMessage('muteUser')
    async muteUser(@MessageBody() [userId,targetId,channelId]: [number, number, number]) {
        try {
            this.chatService.muteMember(userId, targetId, channelId)
            this.server.emit('UpdateChatPage')
            return { message: 'User muted successfully' }
        } catch (error) {
            console.log('Failed to mute user')
        }
    }

    @SubscribeMessage('getMutedUsers')
    async getMutedUsers(@MessageBody() channelId: number) {
        try {
            return await this.chatService.fetchMutedMembers(channelId)
        } catch (error) {
            console.log('Failed to get muted users')
        }
    }

}