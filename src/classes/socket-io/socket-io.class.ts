import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { ServerParameter } from '@/enum/events-sdk.enum'
import {
    AllDialersStatusEvent,
    AllExtensionStatusEvent,
    ConnectionStatusEnum,
    DialerEvent,
    EventsEnum,
    ExtensionEvent,
    ExtensionsUpdated,
    KeepAliveResponseEvent,
    LoginStatusEvent,
    LoginSuccessEvent,
    QueueEvent
} from '@voicenter-team/real-time-events-types'
import { StorageClass } from '@/classes/storage/storage.class'
import EventsHandler from '@/classes/socket-io/events-handler'
import { ServerListenerEventsEnum } from '@/enum/socket.enum'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'

/**
 * SocketIoClass handles WebSocket connections and real-time event management.
 * Manages connection lifecycle, reconnection logic, keep-alive mechanisms,
 * and event routing between the socket and the events SDK.
 */
export class SocketIoClass {
    /**
     * Creates an instance of SocketIoClass and sets up network event listeners.
     * Automatically handles offline/online network state changes for both
     * browser and web worker environments.
     *
     * @param eventsSdkClass - The events SDK instance for managing connections and events
     */
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass

        this.reconnectionTime = eventsSdkClass.options.reconnectionDelay

        // Browser environment - listen for network state changes
        if (typeof window !== 'undefined') {
            window.addEventListener('offline', () => {
                this.closeAllConnections()
            })

            window.addEventListener('online', () => {
                // Wait half a second before attempting reconnection to ensure network stability
                setTimeout(() => {
                    if (this.keepReconnectTimeout) {
                        clearTimeout(this.keepReconnectTimeout)
                    }

                    this.eventsSdkClass.connect(ServerParameter.NEXT)
                }, 500)
            })
        }

        // Web Worker environment - listen for network state changes
        if (typeof self !== 'undefined' && typeof window === 'undefined' && typeof global === 'undefined') {
            self.addEventListener('offline', () => {
                this.closeAllConnections()
            })

            self.addEventListener('online', () => {
                // Wait half a second before attempting reconnection to ensure network stability
                setTimeout(() => {
                    if (this.keepReconnectTimeout) {
                        clearTimeout(this.keepReconnectTimeout)
                    }

                    this.eventsSdkClass.connect(ServerParameter.NEXT)
                }, 500)
            })
        }
    }

    /** The active Socket.IO connection instance */
    public io: SocketTyped | undefined

    /** The Socket.IO function used to create connections based on version */
    public ioFunction: TypedSocketIo | undefined

    /** Timestamp of the last received event, used for keep-alive calculations */
    public lastEventTimestamp = new Date().getTime()

    /** Flag indicating whether automatic reconnection should be attempted */
    public doReconnect = true

    /** Interval handle for the keep-alive mechanism */
    private keepAliveInterval: ReturnType<typeof setInterval> | undefined

    /** Interval handle for reconnection attempts */
    private keepReconnectInterval: ReturnType<typeof setInterval> | undefined

    /** Timeout handle for delayed reconnection attempts */
    private keepReconnectTimeout: ReturnType<typeof setTimeout> | undefined

    /** Flag indicating current connection status */
    private connected = false

    /** Current reconnection delay in seconds, increases with failed attempts */
    private reconnectionTime = eventsSdkDefaultOptions.reconnectionDelay

    /** Maximum reconnection delay in seconds, prevents indefinite delays */
    private maxReconnectionDelay = 120

    /**
     * Determines and sets the appropriate Socket.IO function based on client version.
     * Parses the version string and maps it to the corresponding socket implementation.
     *
     * @param Client - Version string containing the client version (e.g., "client-v1.2.3")
     */
    public getSocketIoFunction (Client: string) {
        // Extract version from client string (e.g., "client-v1.2.3" -> "v1_2_3")
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    /**
     * Initializes a new Socket.IO connection with authentication and configuration.
     * Sets up connection options including transport method, timeout, and authentication token.
     */
    public initSocketConnection () {
        const token = this.eventsSdkClass.authClass.token
        const protocol = this.eventsSdkClass.options.protocol
        const server = this.eventsSdkClass.server

        try {
            // Determine connection URL based on server configuration
            const domain = server ? server.Domain : this.eventsSdkClass.URL
            const url = server ? `${protocol}://${domain}` : this.eventsSdkClass.URL

            // Configure Socket.IO connection options
            const options: Partial<ManagerOptions & SocketOptions> = {
                reconnection: false,        // Manual reconnection handling
                upgrade: false,            // Prevent transport upgrades
                transports: [ 'websocket' ], // Force WebSocket transport
                forceNew: true,            // Always create new connection
                query: {
                    token                  // Include auth token in connection
                },
                timeout: this.eventsSdkClass.options.timeout
            }

            if (this.ioFunction && url) {
                // Create new socket connection
                this.io = this.ioFunction(url, options)

                // Emit connection attempt status
                this.eventsSdkClass.eventEmitterClass.emit(
                    EventsEnum.ONLINE_STATUS_EVENT,
                    {
                        attemptToConnect: url,
                        connectionStatus: ConnectionStatusEnum.TRYING_TO_CONNECT
                    }
                )

                this.eventsSdkClass.loggerClass.sdkAttemptToConnect(domain)
            } else {
                throw new Error('Socket server url no defined')
            }
        } catch (error) {
            this.eventsSdkClass.loggerClass.sdkAttemptToConnectError(error as Error)
        }
    }

    /**
     * Clears the keep-alive interval to stop periodic ping messages.
     * Used when disconnecting or cleaning up resources.
     */
    public clearKeepAliveInterval () {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }
    }

    /**
     * Initializes the keep-alive mechanism to maintain connection health.
     * Sends periodic ping messages when no events have been received
     * within the configured timeout period.
     */
    public initKeepAlive () {
        // Clear any existing keep-alive interval
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }

        this.keepAliveInterval = setInterval(async () => {
            const now = new Date().getTime()

            // Check if we haven't received events within the timeout period
            if (now > this.lastEventTimestamp + this.eventsSdkClass.options.keepAliveTimeout && this.io && this.eventsSdkClass.authClass.token) {
                // Send keep-alive ping to server
                this.eventsSdkClass.emit(ServerListenerEventsEnum.KEEP_ALIVE, this.eventsSdkClass.authClass.token)

                this.eventsSdkClass.loggerClass.keepAliveEmit()

                return
            }

        }, this.eventsSdkClass.options.keepAliveTimeout)
    }

    /**
     * Closes all active connections and cleans up resources.
     * Terminates socket connection, stops logging, and clears session storage.
     */
    public closeAllConnections () {
        if (this.io) {
            // Gracefully close socket connection
            this.io.close()
            this.io?.disconnect()
            this.io = undefined
        }

        // Stop logging and clear session data
        this.eventsSdkClass.loggerClass.stop()
        StorageClass.clearSessionStorage()
    }

    /**
     * Sets up event listeners for all Socket.IO events.
     * Maps socket events to corresponding handler methods for processing.
     */
    public initSocketEvents () {
        if (!this.io) {
            return
        }

        // Register all event handlers with the socket
        this.io
            .on(EventsEnum.LOGIN_SUCCESS, (data) => this.onLoginSuccessEvent(data, EventsEnum.LOGIN_SUCCESS))
            .on(EventsEnum.QUEUE_EVENT, (data) => this.onQueueEvent(data, EventsEnum.QUEUE_EVENT))
            .on(EventsEnum.EXTENSION_EVENT, (data) => this.onExtensionEvent(data, EventsEnum.EXTENSION_EVENT))
            .on(EventsEnum.DIALER_EVENT, (data) => this.onDialerEvent(data, EventsEnum.DIALER_EVENT))
            .on(EventsEnum.LOGIN_STATUS, (data) => this.onLoginStatusEvent(data, EventsEnum.LOGIN_STATUS))
            .on(EventsEnum.ALL_EXTENSION_STATUS, (data) => this.onAllExtensionStatus(data, EventsEnum.ALL_EXTENSION_STATUS))
            .on(EventsEnum.ALL_DIALER_STATUS, (data) => this.onAllDialerStatus(data, EventsEnum.ALL_DIALER_STATUS))
            .on(EventsEnum.KEEP_ALIVE_RESPONSE, (data) => this.onKeepAliveResponse(data))
            .on(EventsEnum.EXTENSIONS_UPDATED, (data) => this.onExtensionsUpdatedEvent(data, EventsEnum.EXTENSIONS_UPDATED))
            .on(EventsEnum.CONNECT, () => this.onConnect())
            .on(EventsEnum.DISCONNECT, (data) => this.onDisconnect(data))
            .on(EventsEnum.CONNECT_ERROR_EVENT, (data) => this.onConnectError(data))
    }

    /**
     * Handles successful login events from the server.
     * Logs the event and forwards it to the event emitter.
     *
     * @param data - Login success event data
     * @param eventName - The event name for logging purposes
     */
    private onLoginSuccessEvent (data: LoginSuccessEvent, eventName: EventsEnum.LOGIN_SUCCESS) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles queue events from the server.
     * Maps the event data and forwards it to the event emitter.
     *
     * @param data - Queue event data
     * @param eventName - The event name for logging purposes
     */
    private onQueueEvent (data: QueueEvent, eventName: EventsEnum.QUEUE_EVENT) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        // Transform queue event data before emitting
        this.eventsSdkClass.eventEmitterClass.emit(eventName, EventsHandler.mapQueueEvent(data))
    }

    /**
     * Handles extension events from the server.
     * Maps and validates event data before forwarding to the event emitter.
     *
     * @param data - Extension event data
     * @param eventName - The event name for logging purposes
     */
    private onExtensionEvent (data: ExtensionEvent, eventName: EventsEnum.EXTENSION_EVENT) {
        // Transform and validate extension event data
        const dataExtended = EventsHandler.mapExtensionEvent(data)

        if (dataExtended) {
            this.eventsSdkClass.loggerClass.eventLog(eventName, data)
            this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
        }
    }

    /**
     * Handles dialer events from the server.
     * Logs the event and forwards it to the event emitter.
     *
     * @param data - Dialer event data
     * @param eventName - The event name for logging purposes
     */
    private onDialerEvent (data: DialerEvent, eventName: EventsEnum.DIALER_EVENT) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles login status events from the server.
     * Maps the event data and forwards it to the event emitter.
     *
     * @param data - Login status event data
     * @param eventName - The event name for logging purposes
     */
    private onLoginStatusEvent (data: LoginStatusEvent, eventName: EventsEnum.LOGIN_STATUS) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        // Transform login status data before emitting
        this.eventsSdkClass.eventEmitterClass.emit(eventName, EventsHandler.mapLoginStatusEvent(data))
    }

    /**
     * Handles all extension status events from the server.
     * Maps the event data and forwards it to the event emitter.
     *
     * @param data - All extension status event data
     * @param eventName - The event name for logging purposes
     */
    private onAllExtensionStatus (data: AllExtensionStatusEvent, eventName: EventsEnum.ALL_EXTENSION_STATUS) {
        // Transform extension status data
        const dataExtended = EventsHandler.mapAllExtensionStatus(data)

        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
    }

    /**
     * Handles all dialer status events from the server.
     * Logs the event and forwards it to the event emitter.
     *
     * @param data - All dialer status event data
     * @param eventName - The event name for logging purposes
     */
    private onAllDialerStatus (data: AllDialersStatusEvent, eventName: EventsEnum.ALL_DIALER_STATUS) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles keep-alive response events from the server.
     * Manages connection health and triggers reconnection if needed.
     *
     * @param data - Keep-alive response event data
     */
    private onKeepAliveResponse (data: KeepAliveResponseEvent) {
        this.eventsSdkClass.loggerClass.keepAliveResponse(data)

        // If server responds with error, attempt reconnection
        if (data.errorCode) {
            this.initSocketConnection()
            return
        }

        if (this.connected) {
            // Update last event timestamp to reset keep-alive timer
            this.lastEventTimestamp = new Date().getTime()
        } else {
            // Not connected but received response, try to reconnect
            this.initSocketConnection()
        }
    }

    /**
     * Handles extension update events from the server.
     * Logs the event and forwards it to the event emitter.
     *
     * @param data - Extensions updated event data
     * @param eventName - The event name for logging purposes
     */
    private onExtensionsUpdatedEvent (data: ExtensionsUpdated, eventName: EventsEnum.EXTENSIONS_UPDATED) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles successful socket connection events.
     * Updates connection state, clears reconnection timers, and starts logging.
     */
    private onConnect () {
        this.connected = true
        // Reset on success!
        this.reconnectionTime = this.eventsSdkClass.options.reconnectionDelay

        // Clear any pending reconnection attempts
        if (this.keepReconnectInterval) {
            clearInterval(this.keepReconnectInterval)
        }

        // Emit connected status to listeners
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: ConnectionStatusEnum.CONNECTED
        })

        // Start logging service and log successful connection
        this.eventsSdkClass.loggerClass.start().then(() => {
            this.eventsSdkClass.loggerClass.sdkConnectionSuccess()
        })
    }

    /**
     * Handles socket disconnection events.
     * Manages reconnection logic with exponential backoff strategy.
     *
     * @param reason - The reason for disconnection
     */
    private onDisconnect (reason: Socket.DisconnectReason) {
        this.connected = false

        // Exit early if reconnection is disabled
        if (!this.doReconnect) {
            return
        }

        // Clean up current connection
        this.closeAllConnections()

        // Emit connection status based on reconnection flag
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: this.doReconnect ? ConnectionStatusEnum.TRYING_TO_CONNECT : ConnectionStatusEnum.DISCONNECTED
        })

        this.eventsSdkClass.loggerClass.sdkDisconnect([ reason ])

        // Schedule reconnection with exponential backoff
        this.keepReconnectTimeout = setTimeout(
            () => {
                // Increase reconnection delay (exponential backoff)
                this.reconnectionTime = Math.min(
                    this.reconnectionTime * 2,
                    this.maxReconnectionDelay
                )

                // Reset delay if it exceeds maximum threshold
                if (this.reconnectionTime > this.maxReconnectionDelay) {
                    this.reconnectionTime = this.eventsSdkClass.options.reconnectionDelay
                }

                this.eventsSdkClass.connect(ServerParameter.NEXT)
            },
            this.reconnectionTime * 1000
        )
    }

    /**
     * Handles socket connection error events.
     * Manages reconnection attempts with exponential backoff strategy.
     *
     * @param data - Error information from the connection attempt
     */
    private onConnectError (data: Error) {
        // Emit connection status based on reconnection flag
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: this.doReconnect ? ConnectionStatusEnum.TRYING_TO_CONNECT : ConnectionStatusEnum.DISCONNECTED
        })

        this.eventsSdkClass.loggerClass.sdkAttemptToConnectError(data)

        // Schedule reconnection with exponential backoff
        this.keepReconnectTimeout = setTimeout(
            () => {
                // Increase reconnection delay (exponential backoff)
                this.reconnectionTime = Math.min(
                    this.reconnectionTime * 2,
                    this.maxReconnectionDelay
                )

                // Reset delay if it exceeds maximum threshold (lower than disconnect)
                if (this.reconnectionTime > this.maxReconnectionDelay) {
                    this.reconnectionTime = this.eventsSdkClass.options.reconnectionDelay
                }

                this.eventsSdkClass.connect(ServerParameter.NEXT)
            },
            this.reconnectionTime * 1000
        )
    }
}
