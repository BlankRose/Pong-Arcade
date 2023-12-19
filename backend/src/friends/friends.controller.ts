import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Body,
    Param,
    Request,
    BadRequestException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { FriendsService } from './friends.service'
import { FriendEditDto } from './dto/Friend-Edit.dto'

@Controller('friend')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}


    @Post('create/:friendId')
    async createFriendshipRequest(@Request() req: any, @Param('friendId') friendId: string) {
        try {
            const requesterId = req.user['id'];
            await this.friendsService.createFriendship(requesterId, +friendId);
            return { success: true, message: 'Friendship request sent successfully' };
        } catch (error) {
            throw new BadRequestException('Failed to send friendship request');
        }
    }
    
    

    @Patch('accept/:friendRequestId')
    // @UsePipes(ValidationPipe)
    async acceptFriendshipRequest(
        @Param('friendRequestId') friendRequestId: string,
        @Body() friendEdit: FriendEditDto
    ) {
        try {
            await this.friendsService.acceptFriendship(+friendRequestId, friendEdit);
            return { success: true, message: 'Friendship request accepted successfully' };
        } catch (error) {
            throw new BadRequestException('Failed to accept friendship request');
        }
    }

    @Delete('delete/:friendshipId')
    async deleteFriendship(@Param('friendshipId') friendshipId: string) {
        try {
            await this.friendsService.deleteFriendship(+friendshipId);
            return { success: true, message: 'Friendship successfully removed' };
        } catch (error) {
            throw new BadRequestException('Failed to remove friendship');
        }
    }

    @Get('mimi')
    handleUnknownRoute() {
    console.log('Unknown route reached');
    return { success: false, message: 'Unknown route' };
    }
    
}
