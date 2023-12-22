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
    Calls: [
        {
            CallerID: '0547649040',
            CallerName: 'תמיכה ותקלות',
            IvrUniqueID: '2023113013195102398b4b08508dc48a',
            JoinTimeStamp: 1701350463,
            calldurationinterval: 1701350463,
            ivrid: '2023113013195102398b4b08508dc48a'
        },
        {
            CallerID: '0508424551',
            CallerName: 'Clicked Callback from site  ENG',
            IvrUniqueID: '202311301322360239e8eeeedaf0153d',
            JoinTimeStamp: 1701350557,
            calldurationinterval: 1701350557,
            ivrid: '202311301322360239e8eeeedaf0153d'
        }
    ]
}
