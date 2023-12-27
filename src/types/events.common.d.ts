import { CallStatusEnum, DialerType, DirectionEnum, DoNotCallMeStatusCodeEnum } from 'enum/events.enum'

export interface Dialer {
    campaignID: number,
    name: string,
    typeID: number,
    type: DialerType,
    code: string,
    calls: unknown,
    statistics: unknown
}

export interface User {
    userID: number,
    userName: string,
    accountID: number

}

export interface Extension {
    calls: ExtensionCall[],
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
    currentCall?: ExtensionCall,
}

export interface Queue {
    QueueID: number,
    QueueName: string,
    Calls: QueueCall[],
    DistributorID?: number,
    IsDistributedQueue?: boolean
}

interface ExtensionCall {
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

interface QueueCall {
    CallerID: string,
    CallerName: string,
    IvrUniqueID: string,
    JoinTimeStamp: number,
    calldurationinterval: number,
    ivrid: string,
    isDistributedQueue?: boolean
}

interface Summery {
    representative: string
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


