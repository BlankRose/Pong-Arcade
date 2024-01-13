import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository, MoreThanOrEqual } from "typeorm";
import {Channel} from "./entities/channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ChannelMessage from "./entities/channelMessage.entity";
import { User } from "src/users/user.entity";
import { NewMessageDto } from "./dto/create-message.dto";
import { NewChannelDto } from "./dto/create-channel.dto";
import * as bcrypt from 'bcrypt'
import { MutedUserChannel } from "./entities/muted-user.entity";

enum ChannelType {
    Private = 'private',
    Public = 'public',
    Direct = 'direct',
}

export default ChannelType

@Injectable()
export class ChatService
{
	constructor(
		@InjectRepository(Channel)
		private channelRepo: Repository<Channel>,

		@InjectRepository(ChannelMessage)
		private messageRepo: Repository<ChannelMessage>,

		@InjectRepository(User)
		private userRepo: Repository<User>,

		@InjectRepository(MutedUserChannel)
        private readonly mutedUserChannelRepo: Repository<MutedUserChannel>
	) {}


	async createMessage(newMessage: NewMessageDto) :Promise<ChannelMessage>{
		const user = await this.userRepo.findOneBy({ id: newMessage.senderId,})
		const { username} = user
		newMessage.username = username
		const newMsg = this.messageRepo.create(newMessage)
		return await this.messageRepo.save(newMsg)
	}
	
	async createChannel(newChannel: NewChannelDto) : Promise<Channel>{
		const user = await this.userRepo.findOneBy({id: newChannel.ownerId})
		newChannel.owner = user
		newChannel.admins = [user]
		newChannel.members = [user]
		newChannel.messages = []
		

		if (newChannel.password) {
			const password = newChannel.password
			newChannel.password = await bcrypt.hash(password, 10)
		}

		const createdChannel = this.channelRepo.create(newChannel)
		return (this.channelRepo.save(createdChannel))
	}

	async addUserToChannel (channelId: number, userId: number, password: string) :Promise<void> {
		const channel = await this.channelRepo.findOne({relations: ['members', 'bannedUsers'], where: {id: channelId}});
		const user = await this.userRepo.findOne({where: { id: userId }})
		if (channel.password != '') {
			const isPasswordValid = await bcrypt.compare(password, channel.password);
			if (!isPasswordValid) {
				throw new UnauthorizedException("Invalid Password")
			}
		}
        if (channel.bannedUsers.some((x) => x.id === user.id)) {
            throw new UnauthorizedException()
        }
        if (channel.type === 'direct') {
            if (channel.members.length === 1) {
                channel.members.push(user)
            } else {
                console.log('Cannot add more than 2 members')
                throw new UnauthorizedException()
            }
        }
		channel.members.push(user)
		await this.channelRepo.save(channel)
	}

	async removeUserFromChannel (channelId: number, userId: number): Promise<void> {
		const channel = await this.channelRepo.findOne({relations: ['members'], where: {id: channelId}})
		const user = await this.userRepo.findOne({where: { id: userId }})
		channel.members = channel.members.filter(x => x.id !== user.id)
		await this.channelRepo.save(channel)
	}

	async changeChannelPassword (channelId: number, password: string): Promise<boolean> {
		try {
			const channel = await this.channelRepo.findOne({where: { id: channelId }})
			channel.password = await bcrypt.hash(password, 10)
		    await this.channelRepo.update(channel.id, channel)
		    return true
		} catch (error) {
			console.error('Failed to change password', error);
			return false
		}
	}

	async deleteChannel (channelId: number, userId: number) {
		const channel = await this.channelRepo.findOne({where: {id: channelId}})
		await this.channelRepo.remove(channel)
	}

	async getChannels() {
		return await this.channelRepo.find({relations: ['owner', 'admins', 'members', 'messages']})
	}

	async ReturnAllMsg(channelId: number): Promise<ChannelMessage[]> {
        const messages = await this.messageRepo.createQueryBuilder('message').where('message.channelId = :channelId', { channelId }).getMany()

        return messages
    }

	async findChannelMessages (channelId: number) : Promise<ChannelMessage[]> {
		const messages = await this.messageRepo.createQueryBuilder('message').where('message.channelId = :channelId', {channelId}).getMany()
		return messages;
	}

	async findChannelMembers (channelId: number) {
		const res =  await this.channelRepo.findOne({
			relations :{
				owner: true,
				members: true,
				admins: true,
				bannedUsers: true,
			},
			where : {id : channelId}
		})

        return res
	}

	async createDirectMsgChannel(userId: number, otherUserId: number) {
        const user = await this.userRepo.findOneBy({id: userId})
        const otherUser = await this.userRepo.findOneBy({id: otherUserId})

        if (await this.isBlockedByUser(userId, otherUserId))
            throw new BadRequestException("Unable to send a message to this user. You have been blocked by them.")
        else if (await this.isBlockedByUser(otherUserId, userId))
            throw new BadRequestException("Please unblock this user to initiate a chat.")
        else {
            let channelName = user.username + ' & ' + otherUser.username
            let channel = await this.channelRepo.findOne({where: { name: channelName },relations: ['members']})
            if (!channel) {
                channelName = otherUser.username + ' & ' + user.username
                let channel = await this.channelRepo.findOne({where: { name: channelName },relations: ['members']})
            }
            if (channel) {
                if (channel.members.some((u) => u.id === user.id)) {
                    return channel
                } else {
                    const joinChannel = await this.addUserToChannel(
                        channel.id,
                        userId,
                        ''
                    )
                    return joinChannel
                }
            } else {
                const newChannelDto = new NewChannelDto()
                newChannelDto.name = user.username + ' & ' + otherUser.username
                newChannelDto.owner = user
                newChannelDto.admins = [user]
                newChannelDto.members = [user, otherUser]
                newChannelDto.type = 'direct'
                newChannelDto.password = ''
                const channelCreated = await this.channelRepo.create(newChannelDto)
                return this.channelRepo.save(channelCreated)
            }
        }
    }

	async fetchDirectMsgChannel(userId: number, otherUserId: number) {
		const user = await	this.userRepo.findOne({where: {id: userId}})
		const otherUser = await this.userRepo.findOne({where: {id: otherUserId}})
	
		const c1 = `${user.username} & ${otherUser.username}`;
		let channel = await this.channelRepo.findOne({ where: { name: c1 } });
	
		if (!channel) {
			const c2 = `${otherUser.username} & ${user.username}`;
			channel = await this.channelRepo.findOne({ where: { name: c2 } });
		}
	
		return channel;
	}
	
	async blockMember(blockerId: number, toBlockId: number) {
		
		const user = await this.userRepo.findOne({
				where: {id: blockerId},
				relations: {blockedMembers: true}, 
			})
		const otherUser = await this.userRepo.findOne({
				where: {id: toBlockId}, 
				relations: {blockers: true} 
			})
		
	
		otherUser.blockers.push(user);
		user.blockedMembers.push(otherUser);
	
		
		await this.userRepo.save(otherUser);
		await this.userRepo.save(user);
	

		const directMsg = await this.fetchDirectMsgChannel(blockerId, toBlockId);
		if (directMsg) {
			await this.channelRepo.remove(directMsg);
		}
	}

	async fetchBlockedMembers(userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId}, relations: { blockedMembers: true}})
        if (user) {
            const blockedMembersId = user.blockedMembers.map(
                (x) => x.id
            )
            return blockedMembersId
        } else {
            return []
        }

    }

	async isBlockedByUser(userId: number, otherUserId: number) {
        const user = await this.userRepo.findOne({where: { id: userId }, relations: { blockers: true}})
        if (user.blockers.some((x) => x.id === otherUserId)) 
		  return true
        else return false
    }

	async unblockMember(blockerId: number, toUnblockId: number) {
        const user = await this.userRepo.findOne({
            where: { id: blockerId},
            relations: {
                blockedMembers: true,
            },
        })

        const otherUser = await this.userRepo.findOne({
            where: { id: toUnblockId},
            relations: {
                blockers: true,
            },
        })

        otherUser.blockers = otherUser.blockers.filter(
            (u) => u.id !== user.id
        )
        await this.userRepo.save(otherUser)

        user.blockedMembers = user.blockedMembers.filter(
            (u) => u.id !== otherUser.id
        )
        await this.userRepo.save(user)
    }

	async kickMember(userId: number, memberToKickId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admins: true,
                members: true,
            },
        })

        const user = await this.userRepo.findOne({
            where: { id: userId },
        })

        const memberToKick = await this.userRepo.findOne({
            where: { id: memberToKickId},
        })

        if (
            channel.owner.id !== memberToKick.id &&
            channel.admins.some((x) => x.id === user.id)
        ) {
            channel.members = channel.members.filter((x) => x.id !== memberToKick.id)
            await this.channelRepo.save(channel)
        } else throw new UnauthorizedException()
    }

    async banMember(userId: number, memberToBanId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admins: true,
                members: true,
                bannedUsers: true,
            },
        })

        const user = await this.userRepo.findOne({
            where: { id: userId },
        })

        const memberToBan = await this.userRepo.findOne({
            where: { id: memberToBanId},
        })

        if (
            channel.owner.id !== memberToBan.id &&
            channel.admins.some((x) => x.id === user.id)
        ) {
            channel.bannedUsers.push(memberToBan)
            channel.members = channel.members.filter((x) => x.id !== memberToBan.id)
            channel.admins = channel.admins.filter((u) => u.id !== memberToBan.id)
            await this.channelRepo.save(channel)
        } else throw new UnauthorizedException()
    }

    async unbanMember(userId: number, memberToUnbanId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                admins: true,
                members: true,
                bannedUsers: true,
            },
        })

        const user = await this.userRepo.findOne({
            where: { id: userId },
        })

        const userToUnban = await this.userRepo.findOne({
            where: { id: memberToUnbanId },
        })

        if (channel.admins.some((u) => u.id === user.id)) {
            channel.bannedUsers = channel.bannedUsers.filter(
                (u) => u.id !== userToUnban.id
            )
            await this.channelRepo.save(channel)
        } else throw new UnauthorizedException()
    }

    async getBannedMembers(channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                bannedUsers: true,
            },
        })
        const bannedUserIds = channel.bannedUsers.map((bannedUser) => bannedUser.id)
        return bannedUserIds
    }

    async muteMember(userId: number, memberToMuteId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admins: true,
            },
        })
        const user = await this.userRepo.findOne({
            where: { id: userId },
        })

        const memberToMute = await this.userRepo.findOne({
            where: { id: memberToMuteId },
        })
        if (
            channel.owner.id !== memberToMute.id &&
            channel.admins.some((x) => x.id === user.id)
        ) {
            const isMuted = await this.mutedUserChannelRepo.findOne({
                where: {
                    mutedUser: { id: memberToMute.id },
                    channel: { id: channelId },
                },
            })
            if (isMuted) throw new BadRequestException('User is already muted')
            const chUserMuted = this.mutedUserChannelRepo.create({
				mutedUser: memberToMute,
				channel: channel,
			});
            this.mutedUserChannelRepo.save(chUserMuted)
        } else throw new UnauthorizedException()
    }

    async fetchMutedMembers(channelId: number) {
        const mutedUsers = await this.mutedUserChannelRepo.find({
            where: { channel: { id: channelId } },
            relations: ['mutedUser'],
        })

        if (mutedUsers.length === 0) return []
        const currentDate = new Date()
        mutedUsers.forEach((x) => {
            if (x.mutedAt.getTime() + 3600000 < currentDate.getTime()) {
                    this.mutedUserChannelRepo.remove(x);
            }
            
        })
        const mutedUserIds = mutedUsers.map((x) => x.mutedUser.id)
        return mutedUserIds
    }

	async setAsAdmin(ownerId: number, adminId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({where: { id: channelId },relations: { owner: true,admins: true}})
        const user = await this.userRepo.findOne({where: { id: ownerId }})

        const newAdmin = await this.userRepo.findOne({where: { id: adminId }})

        if (channel.owner.id === user.id) {
            channel.admins.push(newAdmin)
            await this.channelRepo.save(channel)
        } else {
            throw new UnauthorizedException()
        }
    }

    async unsetAdmin(ownerId: number, adminId: number, channelId: number) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admins: true,
            },
        })
        const user = await this.userRepo.findOne({
            where: { id: ownerId},
        })

        const userToUnset = await this.userRepo.findOne({
            where: { id: adminId },
        })

        if (channel.owner.id === user.id) {
            channel.admins = channel.admins.filter((u) => u.id !== userToUnset.id)
            await this.channelRepo.save(channel)
        } else {
            throw new UnauthorizedException()
        }
    }
	
}
