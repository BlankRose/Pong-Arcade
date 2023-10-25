import { IsNotEmpty, IsOptional } from 'class-validator'
import { UserStatus } from 'src/users/user.entity'
export class CreateUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    avatar: string

    @IsOptional()
    win?: number

    @IsOptional()
    lose?: number

    @IsOptional()
    rank?: number

    @IsOptional()
    _2FAToken?: string

    @IsOptional()
    _2FAEnabled?: boolean

    @IsOptional()
    id42?: string

    @IsOptional()
    status: UserStatus
}
