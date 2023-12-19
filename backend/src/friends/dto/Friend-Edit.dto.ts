import { PartialType } from '@nestjs/mapped-types'
import { FriendCreateDto } from './Friend-Create.dto'

export class FriendEditDto extends PartialType(FriendCreateDto) {}
