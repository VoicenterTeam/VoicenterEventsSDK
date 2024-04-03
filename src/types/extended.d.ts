import { ExtensionEventReasonEnum } from '@voicenter-team/real-time-events-types'
import {
    OriginalAllExtensionStatusEvent,
    OriginalExtensionEvent,
    OriginalExtension,
    OriginalExtensionCall
} from '@/types/realtime-events'

interface CurrentCallUTCExtended extends OriginalExtensionCall {
    callStarted_UTC: number
    callStarted_UTC_CLIENT: number
    callAnswered_UTC: number
    callAnswered_UTC_CLIENT: number
}

interface CurrentCallEnded extends CurrentCallUTCExtended {
    duration: number
}

export type ExtensionCall = CurrentCallUTCExtended | CurrentCallEnded

interface ExtensionUTCExtended extends OriginalExtension {
    currentCall?: CurrentCallUTCExtended
}

interface ExtensionEnded extends OriginalExtension {
    currentCall?: CurrentCallEnded
}

export interface ExtensionEventUTCExtended extends Omit<OriginalExtensionEvent, 'reason' | 'data'> {
    reason: Exclude<ExtensionEventReasonEnum, ExtensionEventReasonEnum.HANGUP>
    data: ExtensionUTCExtended
}

export interface ExtensionEventEnded extends Omit<OriginalExtensionEvent, 'reason' | 'data'> {
    reason: ExtensionEventReasonEnum.HANGUP
    data: ExtensionEnded
}

export type Extension = ExtensionUTCExtended | ExtensionEnded

export interface AllExtensionStatusEventExtended extends Omit<OriginalAllExtensionStatusEvent, 'extensions'> {
    extensions: Array<Extension>
}

export type ExtensionEventExtended = ExtensionEventUTCExtended | ExtensionEventEnded

