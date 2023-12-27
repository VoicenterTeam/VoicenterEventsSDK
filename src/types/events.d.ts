import { EventNameEnum, EventsEnum, ExtensionEventReasonEnum, QueueEventReasonEnum } from '@/enum/events.enum'
import { Queue, Extension, Dialer, User } from '@/types/events.common'

interface BaseEvent {
    // The code of an error, if 0 - no error
    errorCode?: number
    // “Ok” - Connection was establishing successfully.
    errorDesc?: string
    // The Interval the of socket.io protocol
    servertime: number
    // The offset of the server time from the client time
    servertimeoffset: number
}

type LoginSuccessData = BaseEvent

export interface LoginStatusData extends BaseEvent {
    queues: Queue[]
}

export interface AllExtensionStatusData extends BaseEvent {
    extensions: Extension[]
}

export interface AllDialersStatusData extends BaseEvent {
    dialers: Dialer[]
}

export interface AllUsersStatus extends BaseEvent {
    users: User[]
}

export interface QueueEventData extends BaseEvent {
    eventName: EventNameEnum.QUEUE,
    reason: QueueEventReasonEnum,
    telephonyservertime: number,
    ivruniqueid: string,
    data: Queue
}

export interface ExtensionEventData extends BaseEvent {
    data: Extension
    eventName: EventNameEnum.EXTENSION
    reason: ExtensionEventReasonEnum
    telephonyservertime?: number
    callerID?: string
    ivruniqueid?: string
    dialStatus?: string
    cause?: string
}

export interface KeepAliveResponseData extends BaseEvent {
    isOk: boolean
}

export interface EventDataMap {
    [EventsEnum.ALL_EXTENSION_STATUS]: AllExtensionStatusData
    [EventsEnum.ALL_DIALER_STATUS]: AllDialersStatusData
    [EventsEnum.QUEUE_EVENT]: QueueEventData
    [EventsEnum.EXTENSION_EVENT]: ExtensionEventData
    [EventsEnum.LOGIN_SUCCESS]: LoginSuccessData
    [EventsEnum.LOGIN_STATUS]: LoginStatusData
    [EventsEnum.KEEP_ALIVE_RESPONSE]: KeepAliveResponseData
}

type MakeSocketEvent <T> = (data: T) => void

type ListenerEvents = keyof EventDataMap // specifies events which events sdk and client listen to...

export type EventTypeData <T extends EventsEnum> = EventDataMap[T]

export type EventFunctionsMap = {
    [K in ListenerEvents]: MakeSocketEvent<EventDataMap[K]>
}

export type EventFunctionsMap2 = {
    [K in ListenerEvents]: Array<(data: EventDataMap[K]) => void>
}
