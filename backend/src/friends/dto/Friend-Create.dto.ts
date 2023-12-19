import { IsNotEmpty, IsBoolean } from 'class-validator';

export class FriendCreateDto {
    @IsNotEmpty({ message: 'Friend ID should not be empty' })
    friendId: number;

    @IsNotEmpty({ message: 'Friend request status should not be empty' })
    @IsBoolean({ message: 'Friend request status should be a boolean' })
    friendRequestPending: boolean;
}