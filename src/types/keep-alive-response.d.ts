import { BaseEvent } from '@/types/events'

export interface KeepAliveResponse extends BaseEvent {
    isOk: boolean
}