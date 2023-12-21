import { EventNameEnum, ExtensionEventReasonEnum } from 'enum/events.enum'

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
    peerStatus: null,
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
    customdata: {
        DoNotCallMeStatus: '200',
        DoNotCallMeStatusCode: 'RESPONSE_FROM_API_VALID',
        DoNotCallMeTokenName: '514039718_63566392',
        DoNotCallMetransactionId: '70f18891-bc7c-4888-8104-1b9b370a7fab',
        IsDoNotCallMe: '1'
    },
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

enum CallStatusEnum {
    RINGING = 'Ringing',
    TALKING = 'Talking',
    DIALING = 'Dialing',
    HOLD = 'Hold',
}

enum DirectionEnum {
    INCOMING = 'Incoming',
    OUTGOING = 'Outgoing',
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
