import { EventsEnum } from '@/enum/events.enum'

interface BaseEvent {
    // The code of an error, if 0 - no error
    errorCode: number
    // “Ok” - Connection was establishing successfully.
    errorDesc: string
    // The Interval the of socket.io protocol
    servertime: number
    // The offset of the server time from the client time
    servertimeoffset: number
}

type LoginSuccess = BaseEvent

interface AllExtensionStatusData extends BaseEvent {
    extensions: Array<number>
}

interface AllDialersStatusData extends BaseEvent {
    dialers: Array<number>
}

interface QueueEventData extends BaseEvent {
    queue: Array<number>
}

interface ExtensionEventData extends BaseEvent {
    extension: number
}

interface LoginSuccessData extends BaseEvent {
    loginSuccess: LoginSuccess
}

interface LoginStatusData extends BaseEvent {
    loginStatus: LoginSuccess
}

interface KeepAliveResponseData extends BaseEvent {
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
