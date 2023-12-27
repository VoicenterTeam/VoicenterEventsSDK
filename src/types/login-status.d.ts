import { BaseEvent } from '@/types/events'

export interface LoginStatus extends BaseEvent {
    queues: Queue
}