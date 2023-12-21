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
    summery: { representative: 'Orel Dane' },
    onlineUserID: number,
    representative: number,
    representativeStatus: number,
    lastCallEventEpoch: number,
    lastAnsweredCallEventEpoch: number,
    lastHangupCallEpoch: number,
    representativeUpdated: number,
    peerStatus: null,
    currentCall?: {
        callStarted: 1701350654,
        calldurationinterval: 1701350654,
        callAnswered: 1701350664,
        answered: 1,
        callername: '0587267726',
        callerphone: '0587267726',
        callstatus: 'Talking',
        customdata: {
            DoNotCallMeStatus: '200',
            DoNotCallMeStatusCode: 'RESPONSE_FROM_API_VALID',
            DoNotCallMeTokenName: '514039718_63566392',
            DoNotCallMetransactionId: '70f18891-bc7c-4888-8104-1b9b370a7fab',
            IsDoNotCallMe: '1'
        },
        direction: 'Outgoing',
        ivrid: '202311301324110239cd648fdd2be89e',
        recording: {
            Filename: '202311301324110239cd648fdd2be89e-vc984-E6tUCfnq-972587267726.mp3',
            Options: '',
            ApproximateURL: '',
            IsMuted: 0
        },
        did: '',
        ip: '185.138.169.72',
        blcServerID: 0,
        isOpensips: false,
        channel: 'SIP/E6tUCfnq-0000202c',
        channel2: 'SIP/ProviderProxy05-0000202f'
    }

}

interface ExtensionEventDataCall {
    callStarted: number,
    calldurationinterval: number,
    callAnswered: number,
    answered: number,
    callername: string,
    callerphone: string,
    callstatus: 'Dialing',
    customdata: unknown,
    direction: 'Outgoing',
    ivrid: string,
    recording: Recording,
    did: '',
    ip: string,
    blcServerID: number,
    isOpensips: boolean,
    channel: string,
    channel2: string,
    queueID?: number
}

interface Recording {
    Filename: string,
    Options: string,
    ApproximateURL: string,
    IsMuted: number
}
