import {
    ExtensionCall,
    Extension,
    ExtensionEventReasonEnum,
} from '@voicenter-team/real-time-events-types'
import { OriginalAllExtensionStatusEvent, OriginalExtensionEvent } from '@/types/realtime-events'

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

export interface ExtensionEventUTCExtended extends Omit<OriginalExtensionEvent, 'reason' | 'data'> {
    reason: Exclude<ExtensionEventReasonEnum, ExtensionEventReasonEnum.HANGUP>
    data: ExtensionUTCExtended
}

export interface ExtensionEventEnded extends Omit<OriginalExtensionEvent, 'reason' | 'data'> {
    reason: ExtensionEventReasonEnum.HANGUP
    data: ExtensionEnded
}

export type ExtensionDataExtended = ExtensionUTCExtended | ExtensionEnded

export interface AllExtensionStatusEventExtended extends Omit<OriginalAllExtensionStatusEvent, 'extensions'> {
    extensions: Array<ExtensionDataExtended>
}

export type ExtensionEventExtended = ExtensionEventUTCExtended | ExtensionEventEnded

