import {
    QueueEvent,
    Queue,
    QueueCall
} from '@voicenter-team/real-time-events-types'

export interface QueueCallSDK extends QueueCall {
    JoinTimeStamp_UTC: number
    JoinTimeStamp_UTC_CLIENT: number
}

export interface QueueSDK extends Omit<Queue, 'Calls'> {
    Calls?: Array<QueueCallSDK>
}

export interface QueueEventUTCExtended extends Omit<QueueEvent, 'data'> {
    data: QueueSDK
}


