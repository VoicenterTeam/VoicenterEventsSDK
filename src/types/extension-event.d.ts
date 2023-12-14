import { EventNameEnum, ExtensionEventReasonEnum } from 'enum/events.enum'

export interface ExtensionEventData {
    data: unknown
    eventName: EventNameEnum.EXTENSION
    // The reason this event was sent
    reason: ExtensionEventReasonEnum
    // The caller caller ID.
    callerID?: string
    // The call unique Voicenter ID.
    ivruniqueid?: string
    dialStatus?: string
    servertime: number
    servertimeoffset: number
    telephonyservertime: number
}
