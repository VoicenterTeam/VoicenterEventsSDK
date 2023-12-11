import { EventNameEnum, ExtensionEventReasonEnum } from 'enum/events.enum'

export interface ExtensionEventData {
    data: unknown
    eventName: EventNameEnum.EXTENSION
    // The reason this event was sent
    reason: ExtensionEventReasonEnum
    servertime: number
    servertimeoffset: number
    telephonyservertime: number
}
