import { EventNameEnum, QueueEventReasonEnum } from 'enum/events.enum'

export interface QueueEvent {
    eventName: EventNameEnum.QUEUE,
    reason: QueueEventReasonEnum,
    servertime: number,
    servertimeoffset: number,
    telephonyservertime: number,
    ivruniqueid: string,
    data: QueueEventData
}

interface QueueEventData {
    QueueID: number,
    QueueName: string,
    Calls: QueueEventDataCall[]
}

interface QueueEventDataCall {
    CallerID: string,
    CallerName: string,
    IvrUniqueID: string,
    JoinTimeStamp: number,
    calldurationinterval: number,
    ivrid: string
}
