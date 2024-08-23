import { Socket } from 'socket.io-client'
import type { EventCallbackRegistry } from '@/types/events'
import { ServerListenerEventsEnum } from '@/enum/socket.enum'

export interface UpdateMonitoredExtensionsPayload {
    extensionsString: string
}

/**
 * Mapping of event names to their respective data structures.
 * The data structures that we can send to the server
 */
export interface ServerEmitEventDataMap {
    [ServerListenerEventsEnum.UPDATE_MONITORED_EXTENSIONS]: UpdateMonitoredExtensionsPayload
    [ServerListenerEventsEnum.KEEP_ALIVE]: string
}

/**
 * Represents the set of all possible event type names as keys from the ServerEmitEventDataMap.
 * This type is used to define event emitters and data.
 */
export type ServerEmitEventTypeNames = keyof ServerEmitEventDataMap

export type ServerEmitEventCallbackRegistry = {
    [K in ServerEmitEventTypeNames]: (data: ServerEmitEventDataMap[K]) => void
}

export type SocketTyped = Socket<EventCallbackRegistry, ServerEmitEventCallbackRegistry>

