interface BaseEvent {
    // The code of an error, if 0 - no error
    errorCode: number
    // “Ok” - Connection was establishing successfully.
    errorDesc: string
    // The Interval the of socket.io protocol
    servertime: number
    //
    servertimeoffset: number
}

type LoginSuccess = BaseEvent

interface AllExtensionStatus extends BaseEvent {
    extensions: Array<number>
}

interface AllDialersStatus extends BaseEvent {
    dialers: Array<number>
}

type MakeSocketEvent <T> = (data: T) => void

export interface EventMap {
    AllExtensionsStatus: MakeSocketEvent<AllExtensionStatus>
    AllDialersStatus: MakeSocketEvent<AllDialersStatus>
}
