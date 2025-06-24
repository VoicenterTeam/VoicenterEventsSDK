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
 * Connection states to prevent multiple simultaneous connections
 */
enum ConnectionState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected'
}

/**
 * SocketIoClass handles WebSocket connections and real-time event management.
 * Prevents duplicate connections and events with robust state management.
 */
export class SocketIoClass {
    /** The active Socket.IO connection instance */
    public io: SocketTyped | undefined

    /** The Socket.IO function used to create connections based on version */
    public ioFunction: TypedSocketIo | undefined

    /** Timestamp of the last received event, used for keep-alive calculations */
    public lastEventTimestamp = new Date().getTime()

    /** Flag indicating whether automatic reconnection should be attempted */
    public doReconnect = true

    /** Current connection state */
    private connectionState = ConnectionState.DISCONNECTED

    /** Keep-alive interval handle */
    private keepAliveInterval: ReturnType<typeof setInterval> | undefined

    /** Reconnection timeout handle */
    private reconnectTimeout: ReturnType<typeof setTimeout> | undefined

    /** Network reconnect timeout handle (debounced) */
    private networkReconnectTimeout: ReturnType<typeof setTimeout> | undefined

    /** Current reconnection delay in seconds */
    private reconnectionTime = eventsSdkDefaultOptions.reconnectionDelay

    /** Maximum reconnection delay in seconds */
    private readonly maxReconnectionDelay = 120

    /** Network event cleanup functions */
    private networkCleanup: Array<() => void> = []

    /**
     * Creates an instance of SocketIoClass and sets up network event listeners.
     */
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.reconnectionTime = eventsSdkClass.options.reconnectionDelay
        this.setupNetworkListeners()
    }

    /**
     * Sets up network event listeners
     */
    private setupNetworkListeners (): void {
        const handleOffline = () => this.closeAllConnections()
        const handleOnline = () => this.handleNetworkOnline()

        if (typeof window !== 'undefined' && 'addEventListener' in window && typeof window.addEventListener === 'function') {
            // Browser environment

            window.addEventListener('offline', handleOffline)
            window.addEventListener('online', handleOnline)
            this.networkCleanup.push(
                () => window.removeEventListener('offline', handleOffline),
                () => window.removeEventListener('online', handleOnline)
            )
        } else if (typeof self !== 'undefined' && 'addEventListener' in self && typeof self.addEventListener === 'function') {
            // Web Worker environment

            self.addEventListener('offline', handleOffline)
            self.addEventListener('online', handleOnline)
            this.networkCleanup.push(
                () => self.removeEventListener('offline', handleOffline),
                () => self.removeEventListener('online', handleOnline)
            )
        }
        // React Native or other environments - graceful fallback
        // Network monitoring not available, SDK will still function but with slower reconnection
        // When network goes down: disconnect → scheduleReconnect works normally
        // When network comes back up: no immediate detection, must wait for next scheduled retry (up to 120s delay)
        // For better UX in React Native, consider implementing @react-native-community/netinfo
    }

    /**
     * Handles network online with debouncing to prevent rapid reconnects
     */
    private handleNetworkOnline (): void {
        if (this.networkReconnectTimeout) {
            clearTimeout(this.networkReconnectTimeout)
        }

        this.networkReconnectTimeout = setTimeout(() => {
            if (this.connectionState === ConnectionState.DISCONNECTED && this.doReconnect) {
                this.eventsSdkClass.connect(ServerParameter.NEXT)
            }
        }, 500)
    }

    /**
     * Determines and sets the appropriate Socket.IO function based on client version.
     */
    public getSocketIoFunction (Client: string): void {
        const parsedArray = Client.split('v=')
        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    /**
     * Initializes a new Socket.IO connection. Prevents multiple simultaneous connections.
     */
    public initSocketConnection (): void {
        if (this.connectionState !== ConnectionState.DISCONNECTED) {
            return
        }

        this.connectionState = ConnectionState.CONNECTING

        const token = this.eventsSdkClass.authClass.token
        const protocol = this.eventsSdkClass.options.protocol
        const server = this.eventsSdkClass.server

        try {
            const domain = server ? server.Domain : this.eventsSdkClass.URL
            const url = server ? `${protocol}://${domain}` : this.eventsSdkClass.URL

            const options: Partial<ManagerOptions & SocketOptions> = {
                reconnection: false,
                upgrade: false,
                transports: [ 'websocket' ],
                forceNew: true,
                query: { token },
                timeout: this.eventsSdkClass.options.timeout
            }

            if (this.ioFunction && url) {
                this.io = this.ioFunction(url, options)
                this.initSocketEvents()

                this.eventsSdkClass.eventEmitterClass.emit(
                    EventsEnum.ONLINE_STATUS_EVENT,
                    {
                        attemptToConnect: url,
                        connectionStatus: ConnectionStatusEnum.TRYING_TO_CONNECT
                    }
                )

                this.eventsSdkClass.loggerClass.sdkAttemptToConnect(domain)
            } else {
                throw new Error('Socket server url not defined')
            }
        } catch (error) {
            this.connectionState = ConnectionState.DISCONNECTED
            this.eventsSdkClass.loggerClass.sdkAttemptToConnectError(error as Error)
        }
    }

    /**
     * Clears the keep-alive interval
     */
    public clearKeepAliveInterval (): void {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
            this.keepAliveInterval = undefined
        }
    }

    /**
     * Initializes the keep-alive mechanism
     */
    public initKeepAlive (): void {
        this.clearKeepAliveInterval()

        this.keepAliveInterval = setInterval(async () => {
            const now = new Date().getTime()

            if (now > this.lastEventTimestamp + this.eventsSdkClass.options.keepAliveTimeout &&
                this.io &&
                this.connectionState === ConnectionState.CONNECTED &&
                this.eventsSdkClass.authClass.token) {

                this.eventsSdkClass.emit(ServerListenerEventsEnum.KEEP_ALIVE, this.eventsSdkClass.authClass.token)
                this.eventsSdkClass.loggerClass.keepAliveEmit()
            }
        }, this.eventsSdkClass.options.keepAliveTimeout)
    }

    /**
     * Closes all active connections and cleans up resources properly
     */
    public async closeAllConnections (): Promise<void> {
        // Clear all timers first
        this.clearKeepAliveInterval()

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
            this.reconnectTimeout = undefined
        }

        if (this.networkReconnectTimeout) {
            clearTimeout(this.networkReconnectTimeout)
            this.networkReconnectTimeout = undefined
        }

        if (this.io) {
            const socket = this.io
            this.io = undefined // Prevent new operations

            // Proper async cleanup
            try {
                await Promise.race([
                    new Promise<void>((resolve) => {
                        socket.on('disconnect', () => resolve())
                        socket.removeAllListeners() // Remove all listeners before closing
                        socket.close()
                        socket.disconnect()
                    }),
                    new Promise<void>((resolve) => setTimeout(resolve, 1000))
                ])
            } catch (error) {
                // Silent cleanup errors
            }
        }

        this.connectionState = ConnectionState.DISCONNECTED
        this.eventsSdkClass.loggerClass.stop()
        StorageClass.clearSessionStorage()
    }

    /**
     * Sets up event listeners for all Socket.IO events
     */
    public initSocketEvents (): void {
        if (!this.io) return

        // Remove any existing listeners first to prevent duplicates
        this.io.removeAllListeners()

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
     * Updates timestamp on every event to prevent unnecessary keep-alives
     */
    private updateEventTimestamp (): void {
        this.lastEventTimestamp = new Date().getTime()
    }

    // Event handlers - all update timestamp first
    private onLoginSuccessEvent (data: LoginSuccessEvent, eventName: EventsEnum.LOGIN_SUCCESS): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onQueueEvent (data: QueueEvent, eventName: EventsEnum.QUEUE_EVENT): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, EventsHandler.mapQueueEvent(data))
    }

    private onExtensionEvent (data: ExtensionEvent, eventName: EventsEnum.EXTENSION_EVENT): void {
        this.updateEventTimestamp()
        const dataExtended = EventsHandler.mapExtensionEvent(data)

        if (dataExtended) {
            this.eventsSdkClass.loggerClass.eventLog(eventName, data)
            this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
        }
    }

    private onDialerEvent (data: DialerEvent, eventName: EventsEnum.DIALER_EVENT): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onLoginStatusEvent (data: LoginStatusEvent, eventName: EventsEnum.LOGIN_STATUS): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, EventsHandler.mapLoginStatusEvent(data))
    }

    private onAllExtensionStatus (data: AllExtensionStatusEvent, eventName: EventsEnum.ALL_EXTENSION_STATUS): void {
        this.updateEventTimestamp()
        const dataExtended = EventsHandler.mapAllExtensionStatus(data)
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
    }

    private onAllDialerStatus (data: AllDialersStatusEvent, eventName: EventsEnum.ALL_DIALER_STATUS): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles keep-alive response - fixed to prevent multiple connections
     */
    private onKeepAliveResponse (data: KeepAliveResponseEvent): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.keepAliveResponse(data)

        if (data.errorCode) {
            // Close and schedule reconnect instead of immediate reconnect
            this.closeAllConnections().then(() => {
                if (this.doReconnect && this.connectionState === ConnectionState.DISCONNECTED) {
                    this.scheduleReconnect()
                }
            })
            return
        }

        // Keep-alive successful - just update timestamp, don't create new connections
        // The connection is already established if we're receiving keep-alive responses
    }

    private onExtensionsUpdatedEvent (data: ExtensionsUpdated, eventName: EventsEnum.EXTENSIONS_UPDATED): void {
        this.updateEventTimestamp()
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    /**
     * Handles successful connection
     */
    private onConnect (): void {
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectionTime = this.eventsSdkClass.options.reconnectionDelay // Reset delay

        // Clear reconnection timeout
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
            this.reconnectTimeout = undefined
        }

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: ConnectionStatusEnum.CONNECTED
        })

        this.eventsSdkClass.loggerClass.start().then(() => {
            this.eventsSdkClass.loggerClass.sdkConnectionSuccess()
        })
    }

    /**
     * Schedules reconnection with exponential backoff
     */
    private scheduleReconnect (): void {
        if (!this.doReconnect || this.reconnectTimeout) {
            return // Already scheduled or disabled
        }

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: ConnectionStatusEnum.TRYING_TO_CONNECT
        })

        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = undefined

            // Exponential backoff
            this.reconnectionTime = Math.min(
                this.reconnectionTime * 2,
                this.maxReconnectionDelay
            )

            if (this.reconnectionTime > this.maxReconnectionDelay) {
                this.reconnectionTime = this.eventsSdkClass.options.reconnectionDelay
            }

            this.eventsSdkClass.connect(ServerParameter.NEXT)
        }, this.reconnectionTime * 1000)
    }

    /**
     * Handles disconnection
     */
    private onDisconnect (reason: Socket.DisconnectReason): void {
        this.connectionState = ConnectionState.DISCONNECTED
        this.eventsSdkClass.loggerClass.sdkDisconnect([ reason ])

        if (!this.doReconnect) {
            this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
                connectionStatus: ConnectionStatusEnum.DISCONNECTED
            })
            return
        }

        this.closeAllConnections()
        this.scheduleReconnect()
    }

    /**
     * Handles connection errors
     */
    private onConnectError (data: Error): void {
        this.connectionState = ConnectionState.DISCONNECTED
        this.eventsSdkClass.loggerClass.sdkAttemptToConnectError(data)

        if (this.doReconnect) {
            this.scheduleReconnect()
        } else {
            this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
                connectionStatus: ConnectionStatusEnum.DISCONNECTED
            })
        }
    }

    /**
     * Cleanup when shutting down
     */
    public async destroy (): Promise<void> {
        this.doReconnect = false
        this.networkCleanup.forEach(cleanup => cleanup())
        await this.closeAllConnections()
    }
}
