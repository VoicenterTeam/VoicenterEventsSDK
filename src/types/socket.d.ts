import { Socket } from 'socket.io-client'
import { EventCallbackRegistry } from '@/types/events'

export enum ServerListenerEventsEnum {
    UPDATE_MONITORED_EXTENSIONS = 'updateMonitoredExtensions'
}

export interface UpdateMonitoredExtensionsPayload {
    extensionsString: string
}

/**
 * Mapping of event names to their respective data structures.
 * The data structures that we can send to the server
 */
export interface ServerEmitEventDataMap {
    [ServerListenerEventsEnum.UPDATE_MONITORED_EXTENSIONS]: UpdateMonitoredExtensionsPayload
}

/**
 * Represents the set of all possible event type names as keys from the ServerEmitEventDataMap.
 * This type is used to define event emitters and data.
 */
export type ServerEmitEventTypeNames = keyof ServerEmitEventDataMap

/**
 * The structure of event data for a specific event type that we can send to the server.
 */
export type ServerEmitEventTypeData<T extends ServerListenerEventsEnum> = ServerEmitEventDataMap[T]

export type SocketTyped = Socket<EventCallbackRegistry, ServerEmitEventDataMap>
