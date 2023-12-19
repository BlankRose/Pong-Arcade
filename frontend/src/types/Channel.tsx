
import User  from './userType'



export enum ChannelType {
               Private = 'private',
               Public = 'public',
               Direct = 'direct',
}

export interface Channel {
    id: number
    name: string
    type: string
    password?: string
    creationDate?: Date
    users: User[]
    owner: User
}
