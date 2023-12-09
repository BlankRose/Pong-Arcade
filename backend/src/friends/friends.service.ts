import {
    Request,
    Param,
    BadRequestException,
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Brackets, Repository } from 'typeorm';
import { Friend } from './friends.entity';
import { FriendCreateDto } from './dto/Friend-Create.dto';
import { FriendEditDto } from './dto/Friend-Edit.dto';
import {User} from '../users/user.entity'

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
  ) {}

  async createFriendship(userId: number, @Param('id') friendId: number) {
    const currentUser = await this.userRepository.findOneBy({id: userId});
    const friendUser = await this.userRepository.findOneBy({ id: friendId});

    const friendship = this.friendRepo.create({
        isPending: true,
        user: currentUser,
        friend: friendUser,
        createdBy: currentUser,
    });

    return this.friendRepo.save(friendship);
}

async findFriendByIdWithUser(friendId: number) {
    return this.friendRepo
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user', 'user')
        .where('friend.id = :id', { id: friendId })
        .getOne();
}

async acceptFriendship(id: number, friendEdit: FriendEditDto) {
    const friendship = await this.friendRepo.findOneBy({id: id});
    if (!friendship) {
        throw new NotFoundException('Friendship not found');
    }
    return this.friendRepo.save({ ...friendship, ...friendEdit })
}

async fetchUserConnections(userId: number) {
    const connectionsAsCreator = await this.friendRepo
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.friend', 'user')
        .leftJoinAndSelect('friend.createdBy', 'creator')
        .where('friend.userId = :userId', { userId })
        .addSelect([
            'user.id',
            'user.username',
            'user.avatar',
            'user.status',
            'creator.id',
        ])
        .getMany();

    const connectionsAsRecipient = await this.friendRepo
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user', 'user')
        .leftJoinAndSelect('friend.createdBy', 'creator')
        .where('friend.friendId = :userId', { userId })
        .addSelect([
            'user.id',
            'user.username',
            'user.avatar',
            'user.status',
            'creator.id',
        ])
        .getMany();

    const allConnections = [...connectionsAsCreator, ...connectionsAsRecipient];
    const pendingConnections = allConnections.filter((friend) => friend.isPending);
    const acceptedConnections = allConnections.filter((friend) => !friend.isPending);

    return { userId, acceptedConnections, pendingConnections };
}

async deleteFriendship(id: number) {
    const friendship = await this.findFriendByIdWithUser(id);
    if (!friendship) {
        throw new NotFoundException('Friendship not found');
    }

    await this.friendRepo.remove(friendship);
    return { message: 'Friendship successfully deleted' };
}


}