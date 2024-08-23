import {
    ExtensionEventReasonEnum
} from '@voicenter-team/real-time-events-types'
import type { ExtensionCall, Extension, ExtensionEvent, AllExtensionStatusEvent } from '@voicenter-team/real-time-events-types'

export interface CurrentCallUTCExtended extends ExtensionCall {
    callStarted_UTC: number
    callStarted_UTC_CLIENT: number
    callAnswered_UTC: number
    callAnswered_UTC_CLIENT: number
}

export interface CurrentCallEnded extends CurrentCallUTCExtended {
    duration: number
}

export type ExtensionCallSDK = CurrentCallUTCExtended | CurrentCallEnded

export interface ExtensionUTCExtended extends Extension {
    lastAnsweredCallEventEpoch_UTC: number
    lastAnsweredCallEventEpoch_UTC_CLIENT: number
    lastCallEventEpoch_UTC: number
    lastCallEventEpoch_UTC_CLIENT: number
    lastHangupCallEpoch_UTC: number
    lastHangupCallEpoch_UTC_CLIENT: number
    representativeUpdated_UTC: number
    representativeUpdated_UTC_CLIENT: number
}

export interface ExtensionCallsUTCExtended extends ExtensionUTCExtended {
    currentCall?: CurrentCallUTCExtended
    calls?: Array<CurrentCallUTCExtended>
}

export interface ExtensionCallsEnded extends ExtensionUTCExtended {
    currentCall?: CurrentCallEnded
    calls?: Array<CurrentCallUTCExtended>
}

export interface ExtensionEventUTCExtended extends Omit<ExtensionEvent, 'reason' | 'data'> {
    reason: Exclude<ExtensionEventReasonEnum, ExtensionEventReasonEnum.HANGUP>
    data: ExtensionCallsUTCExtended
}

export interface ExtensionEventEnded extends Omit<ExtensionEvent, 'reason' | 'data'> {
    reason: ExtensionEventReasonEnum.HANGUP
    data: ExtensionCallsEnded
}

export type ExtensionSDK = ExtensionCallsUTCExtended | ExtensionCallsEnded

export interface AllExtensionStatusEventExtended extends Omit<AllExtensionStatusEvent, 'extensions'> {
    extensions: Array<ExtensionSDK>
}

export type ExtensionEventExtended = ExtensionEventUTCExtended | ExtensionEventEnded

