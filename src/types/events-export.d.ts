import { EventsEnum } from '@voicenter-team/real-time-events-types'
import { EventTypeData } from '@/types/events'

/**
 * Event types declared for being used in the application.
 * These are just aliases for the EventTypeData type.
 * We need that for the IDE to show the correct type of the event data, based on if the event is extended or not.
 * NOT FOR USAGE IN THE EVENTS SDK CODEBASE, JUST FOR USAGE IN THE APPLICATION CODEBASE.
 */

export type LoginSuccessEvent = EventTypeData<EventsEnum.LOGIN_SUCCESS>
export type LoginStatusEvent = EventTypeData<EventsEnum.LOGIN_STATUS>
export type AllExtensionStatusEvent = EventTypeData<EventsEnum.ALL_EXTENSION_STATUS>
export type AllDialersStatusEvent = EventTypeData<EventsEnum.ALL_DIALER_STATUS>
export type AllUsersStatusEvent = EventTypeData<EventsEnum.ALL_USERS_STATUS>
export type QueueEvent = EventTypeData<EventsEnum.QUEUE_EVENT>
export type ExtensionEvent = EventTypeData<EventsEnum.EXTENSION_EVENT>
export type KeepAliveResponseEvent = EventTypeData<EventsEnum.KEEP_ALIVE_RESPONSE>
export type DialerEvent = EventTypeData<EventsEnum.DIALER_EVENT>
export type ExtensionsUpdated = EventTypeData<EventsEnum.EXTENSIONS_UPDATED>
export type OnlineStatusEvent = EventTypeData<EventsEnum.ONLINE_STATUS_EVENT>
