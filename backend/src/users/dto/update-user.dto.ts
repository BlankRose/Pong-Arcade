import { PartialType } from '@nestjs/mapped-types'
import { CreateUser } from './create-user.dto'
import { IsNotEmpty } from 'class-validator'
import { UserStatus } from 'src/users/user.entity'

export class UpdateUser extends PartialType(CreateUser) {
    @IsNotEmpty()
    id: number;
    status: UserStatus
}
