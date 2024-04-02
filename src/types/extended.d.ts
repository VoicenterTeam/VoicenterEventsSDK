import {
    ExtensionEvent,
    ExtensionCall,
    Extension,
    ExtensionEventReasonEnum,
    AllExtensionStatusEvent
} from '@voicenter-team/real-time-events-types'

interface CurrentCallUTCExtended extends ExtensionCall {
    callStarted_UTC: number
    callStarted_UTC_CLIENT: number
    callAnswered_UTC: number
    callAnswered_UTC_CLIENT: number
}

interface CurrentCallEnded extends CurrentCallUTCExtended {
    duration: number
}

interface ExtensionUTCExtended extends Extension {
    currentCall?: CurrentCallUTCExtended
}

interface ExtensionEnded extends Extension {
    currentCall?: CurrentCallEnded
}

export interface ExtensionEventUTCExtended extends Omit<ExtensionEvent, 'reason' | 'data'> {
    reason: Exclude<ExtensionEventReasonEnum, ExtensionEventReasonEnum.HANGUP>
    data: ExtensionUTCExtended
}

export interface ExtensionEventEnded extends Omit<ExtensionEvent, 'reason' | 'data'> {
    reason: ExtensionEventReasonEnum.HANGUP
    data: ExtensionEnded
}

export type ExtensionDataExtended = ExtensionUTCExtended | ExtensionEnded

export interface AllExtensionStatusEventExtended extends Omit<AllExtensionStatusEvent, 'extensions'> {
    extensions: Array<ExtensionDataExtended>
}

export type ExtensionEventExtended = ExtensionEventUTCExtended | ExtensionEventEnded

