import { BaseEvent } from '@/types/events'
import { Queue } from '@/types/queue-event'

export interface LoginStatus extends BaseEvent {
    queues: Queue[]
}