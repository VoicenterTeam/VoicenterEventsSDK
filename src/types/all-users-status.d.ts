import { BaseEvent } from '@/types/events'

export interface AllUsersStatus extends BaseEvent {
    users: User[]
}

interface User {
    userID: number,
    userName: string,
    accountID: number

}