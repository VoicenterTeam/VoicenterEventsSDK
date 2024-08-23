import {
    EventsEnum
} from '@voicenter-team/real-time-events-types'
import type {
    ExtensionEvent,
    AllDialersStatusEvent,
    AllExtensionStatusEvent,
    AllUsersStatusEvent,
    QueueEvent,
    DialerEvent,
    LoginSuccessEvent,
    LoginStatusEvent,
    KeepAliveResponseEvent,
    OnlineStatusEvent,
    ExtensionsUpdated
} from '@voicenter-team/real-time-events-types'

import { AllExtensionStatusEventExtended } from '@/types/sdk-extension-extended'
import type { ExtensionEventExtended } from '@/types/sdk-extension-extended'
import { QueueEventUTCExtended } from '@/types/sdk-queue-extended'

/**
 * Mapping of event names to their respective data structures.
 * The data structures that socket io will send us
 */
export interface EventDataMap {
    [EventsEnum.ALL_EXTENSION_STATUS]: AllExtensionStatusEvent
    [EventsEnum.ALL_DIALER_STATUS]: AllDialersStatusEvent
    [EventsEnum.ALL_USERS_STATUS]: AllUsersStatusEvent
    [EventsEnum.QUEUE_EVENT]: QueueEvent
    [EventsEnum.EXTENSION_EVENT]: ExtensionEvent
    [EventsEnum.DIALER_EVENT]: DialerEvent
    [EventsEnum.LOGIN_SUCCESS]: LoginSuccessEvent
    [EventsEnum.LOGIN_STATUS]: LoginStatusEvent
    [EventsEnum.KEEP_ALIVE_RESPONSE]: KeepAliveResponseEvent
    [EventsEnum.ONLINE_STATUS_EVENT]: OnlineStatusEvent
    [EventsEnum.EXTENSIONS_UPDATED]: ExtensionsUpdated
}

/**
 * Mapping of event names to their respective data structures.
 * The data structures that we will send to the end user, here we can modify the type of events data
 */
export interface EventDataMapExtended extends EventDataMap {
    [EventsEnum.EXTENSION_EVENT]: ExtensionEventExtended
    [EventsEnum.ALL_EXTENSION_STATUS]: AllExtensionStatusEventExtended
    [EventsEnum.QUEUE_EVENT]: QueueEventUTCExtended
}

/**
 * Represents the set of all possible event type names as keys from the EventDataMap.
 * This type is used to define event listeners and handlers.
 */
export type EventTypeNames = keyof EventDataMap

/**
 * The structure of received socket events.
 */
export type WrappedSocketEvent<T extends EventsEnum> = {
    name: T
    data: EventDataMapExtended[T]
}

export type EventData = EventDataMapExtended[EventsEnum]

/**
 * The structure of event data for a specific event type.
 */
export type EventTypeData<T extends EventsEnum> = EventDataMapExtended[T]

/**
 * Defines a registry of callback functions for each event type.
 * Each key is an event type name, and the value is a function that takes the specific event data type as an argument.
 * This registry is used to manage and invoke event-specific callbacks.
 */
export type EventCallbackRegistry = {
    [K in EventTypeNames]: (data: EventDataMap[K]) => void
}

/**
 * This is a generic type for callback functions used in event handling.
 * It takes a generic event name and defines a callback function that receives wrapped socket event data for that specific event.
 */
export type EventSpecificCallback<T extends EventTypeNames> = (data: WrappedSocketEvent<T>) => void

/**
 * This type defines a map where each key is an event name, and the value is an array of callback functions associated with that event.
 * This structure is used to manage event listeners for different events
 */
export type EventCallbackListenersMap = {
    [K in EventTypeNames]: Array<EventSpecificCallback<K>>
}

/**
 * This type represents a mapping of listener event names to their corresponding wrapped socket event data structures.
 * Each key is an event name, and the value is the wrapped socket event data for that event
 */
export type EventWrappedSocketDataMap = {
    [K in EventTypeNames]: WrappedSocketEvent<K>
}

/**
 * A generic type that represents the structure of any event data wrapped in a socket event format.
 * This type is used in the handling of all event types, providing a consistent structure for event data processing.
 */
export type GenericEventWrapper = EventWrappedSocketDataMap[EventTypeNames]
