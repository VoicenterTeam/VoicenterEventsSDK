import {
    CallStatusEnum,
    DirectionEnum,
    DoNotCallMeStatusCodeEnum,
    EventNameEnum,
    ExtensionEventReasonEnum
} from 'enum/events.enum'

export interface ExtensionEvent {
    data: ExtensionEventData
    eventName: EventNameEnum.EXTENSION
    reason: ExtensionEventReasonEnum
    servertime: number
    servertimeoffset: number
    telephonyservertime?: number
    callerID?: string
    ivruniqueid?: string
    dialStatus?: string
    cause?: string
}

interface ExtensionEventData {
    calls: ExtensionEventDataCall[],
    userID: number,
    userName: string,
    number: number,
    extenUser: string,
    accountID: number,
    topAccountID: number,
    summery: Summery,
    onlineUserID: number,
    representative: number,
    representativeStatus: number,
    lastCallEventEpoch: number,
    lastAnsweredCallEventEpoch: number,
    lastHangupCallEpoch: number,
    representativeUpdated: number,
    peerStatus: unknown,
    currentCall?: ExtensionEventDataCall,

}

interface ExtensionEventDataCall {
    callStarted: number,
    calldurationinterval: number,
    callAnswered: number,
    answered: number,
    callername: string,
    callerphone: string,
    callstatus: CallStatusEnum,
    customdata: CustomData,
    direction: DirectionEnum,
    ivrid: string,
    recording: Recording,
    did: string,
    ip: string,
    blcServerID: number,
    isOpensips: boolean,
    channel: string,
    channel2: string,
    queueID?: number
}

interface CustomData {
    DoNotCallMeStatus?: string,
    DoNotCallMeStatusCode?: DoNotCallMeStatusCodeEnum,
    DoNotCallMeTokenName?: string,
    DoNotCallMetransactionId?: string,
    IsDoNotCallMe?: string
}

interface Recording {
    Filename: string,
    Options: string,
    ApproximateURL: string,
    IsMuted: number
}

interface Summery {
    representative: string
}
