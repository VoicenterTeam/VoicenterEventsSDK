import {
    EventsEnum,
    CustomData,
    Dialer,
    Error,
    Queue,
    QueueCall,
    Recording,
    Response,
    Summery,
    User
} from '@voicenter-team/real-time-events-types'
import { EventTypeData } from '@/types/events'

/**
 * Event types declared for being used in the application.
 * These are just aliases for the EventTypeData type.
 * We need that for the IDE to show the correct type of the event data, based on if the event is extended or not.
 * NOT FOR USAGE IN THE EVENTS SDK CODEBASE, JUST FOR USAGE IN THE APPLICATION CODEBASE.
 */
export { ExtensionSDK, ExtensionCallSDK } from '@/types/extended'

export type LoginSuccessEventSDK = EventTypeData<EventsEnum.LOGIN_SUCCESS>
export type LoginStatusEventSDK = EventTypeData<EventsEnum.LOGIN_STATUS>
export type AllExtensionStatusEventSDK = EventTypeData<EventsEnum.ALL_EXTENSION_STATUS>
export type AllDialersStatusEventSDK = EventTypeData<EventsEnum.ALL_DIALER_STATUS>
export type AllUsersStatusEventSDK = EventTypeData<EventsEnum.ALL_USERS_STATUS>
export type QueueEventSDK = EventTypeData<EventsEnum.QUEUE_EVENT>
export type ExtensionEventSDK = EventTypeData<EventsEnum.EXTENSION_EVENT>
export type KeepAliveResponseEventSDK = EventTypeData<EventsEnum.KEEP_ALIVE_RESPONSE>
export type DialerEventSDK = EventTypeData<EventsEnum.DIALER_EVENT>
export type ExtensionsUpdatedSDK = EventTypeData<EventsEnum.EXTENSIONS_UPDATED>
export type OnlineStatusEventSDK = EventTypeData<EventsEnum.ONLINE_STATUS_EVENT>

export type CustomDataSDK = CustomData
export type DialerSDK = Dialer
export type ErrorSDK = Error
export type QueueSDK = Queue
export type QueueCallSDK = QueueCall
export type RecordingSDK = Recording
export type ResponseSDK = Response
export type SummerySDK = Summery
export type UserSDK = User
