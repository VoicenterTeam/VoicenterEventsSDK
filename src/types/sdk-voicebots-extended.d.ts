import type {
    VoicebotEvent,
    VoicebotEventDataCall,
    Voicebot,
    VoicebotEventDataCallEventsData,
    VoicebotEventData,
    AllVoicebotsStatus,
    InitialVoicebotCallHistory
} from '@voicenter-team/real-time-events-types'

export interface VoicebotEventExtended extends Omit<VoicebotEvent, 'data'> {
    data: VoicebotEventDataExtended
}

export interface VoicebotExtended extends  Omit<Voicebot, 'Calls'> {
    Calls: Array<VoicebotCallUTCExtended>

}

export interface VoicebotEventDataExtended extends Omit<VoicebotEventData, 'Call'> {
    Call: VoicebotCallUTCExtended
}
export interface VoicebotCallUTCExtended extends  Omit<VoicebotEventDataCall, 'eventsData'>{
    callStarted_UTC: number
    callStarted_UTC_CLIENT: number
    eventsData: Array<VoicebotEventDataCallEventsDataExtended>
}

export interface VoicebotEventDataCallEventsDataExtended extends VoicebotEventDataCallEventsData {
    Timestamp_UTC: number
    Timestamp_UTC_CLIENT: number
}

export interface AllVoicebotStatusExtended extends Omit<AllVoicebotsStatus, 'voicebots'> {
    voicebots: Array<VoicebotExtended>
}

export interface InitialVoicebotCallHistoryExtended extends Omit<InitialVoicebotCallHistory, 'history'> {
    history: Array<VoicebotCallUTCExtended>
}


