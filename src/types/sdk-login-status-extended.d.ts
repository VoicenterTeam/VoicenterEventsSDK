import type {
    LoginStatusEvent
} from '@voicenter-team/real-time-events-types'
import { QueueSDK } from '@/types/sdk-queue-extended'

export interface LoginStatusEventUTCExtended extends Omit<LoginStatusEvent, 'queues'> {
    queues: Array<QueueSDK>
}


