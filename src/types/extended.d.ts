import { ExtensionEvent, ExtensionCall, Extension } from '@voicenter-team/real-time-events-types'

interface CurrentCallExtended extends ExtensionCall {
    callStartedUTC?: number,
    callStartedUTCClient?: number,
    callAnsweredUTC?: number,
    callAnsweredUTCClient?: number
}

interface ExtensionExtended extends Extension {
    currentCall?: CurrentCallExtended
}

export interface ExtensionEventExtended extends ExtensionEvent {
    data: ExtensionExtended
}