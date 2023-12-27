import { EventNameEnum, QueueEventReasonEnum } from 'enum/events.enum'

export interface QueueEvent {
    eventName: EventNameEnum.QUEUE,
    reason: QueueEventReasonEnum,
    servertime: number,
    servertimeoffset: number,
    telephonyservertime: number,
    ivruniqueid: string,
    data: Queue
}

export interface Queue {
    QueueID: number,
    QueueName: string,
    Calls: Call[],
    DistributorID?: number,
    IsDistributedQueue?: boolean
}

export interface Call {
    CallerID: string,
    CallerName: string,
    IvrUniqueID: string,
    JoinTimeStamp: number,
    calldurationinterval: number,
    ivrid: string,
    isDistributedQueue?: boolean
}
