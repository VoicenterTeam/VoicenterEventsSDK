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

export class SocketIoClass {
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass

        if (typeof window !== 'undefined') {
            window.addEventListener('offline', () => {
                this.closeAllConnections()
            })

            window.addEventListener('online', () => {
                setTimeout(() => {
                    if (this.keepReconnectTimeout) {
                        clearTimeout(this.keepReconnectTimeout)
                    }

                    this.eventsSdkClass.connect(ServerParameter.NEXT)
                }, 5000)
            })
        }

        if (typeof self !== 'undefined' && typeof window === 'undefined' && typeof global === 'undefined') {
            self.addEventListener('offline', () => {
                this.closeAllConnections()
            })

            self.addEventListener('online', () => {
                setTimeout(() => {
                    if (this.keepReconnectTimeout) {
                        clearTimeout(this.keepReconnectTimeout)
                    }

                    this.eventsSdkClass.connect(ServerParameter.NEXT)
                }, 5000)
            })
        }
    }

    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    public lastEventTimestamp = new Date().getTime()
    public doReconnect = true
    private keepAliveInterval: ReturnType<typeof setInterval> | undefined
    private keepReconnectInterval: ReturnType<typeof setInterval> | undefined
    private keepReconnectTimeout: number | undefined
    private connected = false
    private reconnectionTime = 20

    public getSocketIoFunction (Client: string) {
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    public initSocketConnection () {
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
                query: {
                    token
                },
                timeout: this.eventsSdkClass.options.timeout
            }

            if (this.ioFunction && url) {
                this.io = this.ioFunction(url, options)

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

    public initKeepAlive () {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }

        this.keepAliveInterval = setInterval(async () => {
            const now = new Date().getTime()

            if (now > this.lastEventTimestamp + this.eventsSdkClass.options.keepAliveTimeout && this.io && this.eventsSdkClass.authClass.token) {
                this.eventsSdkClass.emit(ServerListenerEventsEnum.KEEP_ALIVE, this.eventsSdkClass.authClass.token)

                this.eventsSdkClass.loggerClass.keepAliveEmit()

                return
            }

        }, this.eventsSdkClass.options.keepAliveTimeout)
    }

    public closeAllConnections () {
        if (this.io) {
            this.io.close()

            this.io?.disconnect()

            this.io = undefined
        }

        this.eventsSdkClass.loggerClass.stop()

        StorageClass.clearSessionStorage()
    }

    public initSocketEvents () {
        if (!this.io) {
            return
        }

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

    private onLoginSuccessEvent (data: LoginSuccessEvent, eventName: EventsEnum.LOGIN_SUCCESS) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)

        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onQueueEvent (data: QueueEvent, eventName: EventsEnum.QUEUE_EVENT) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)

        this.eventsSdkClass.eventEmitterClass.emit(eventName, EventsHandler.mapQueueEvent(data))
    }

    private onExtensionEvent (data: ExtensionEvent, eventName: EventsEnum.EXTENSION_EVENT) {
        const dataExtended = EventsHandler.mapExtensionEvent(data)

        if (dataExtended) {
            this.eventsSdkClass.loggerClass.eventLog(eventName, data)

            this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
        }
    }

    private onDialerEvent (data: DialerEvent, eventName: EventsEnum.DIALER_EVENT) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)

        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onLoginStatusEvent (data: LoginStatusEvent, eventName: EventsEnum.LOGIN_STATUS) {
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onAllExtensionStatus (data: AllExtensionStatusEvent, eventName: EventsEnum.ALL_EXTENSION_STATUS) {
        const dataExtended = EventsHandler.mapAllExtensionStatus(data)

        this.eventsSdkClass.loggerClass.eventLog(eventName, data)

        this.eventsSdkClass.eventEmitterClass.emit(eventName, dataExtended)
    }

    private onAllDialerStatus (data: AllDialersStatusEvent, eventName: EventsEnum.ALL_DIALER_STATUS) {
        this.eventsSdkClass.loggerClass.eventLog(eventName, data)

        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onKeepAliveResponse (data: KeepAliveResponseEvent) {
        this.eventsSdkClass.loggerClass.keepAliveResponse(data)

        if (data.errorCode) {
            this.initSocketConnection()

            return
        }

        if (this.connected) {
            this.lastEventTimestamp = new Date().getTime()
        } else {
            this.initSocketConnection()
        }
    }

    private onExtensionsUpdatedEvent (data: ExtensionsUpdated, eventName: EventsEnum.EXTENSIONS_UPDATED) {
        this.eventsSdkClass.eventEmitterClass.emit(eventName, data)
    }

    private onConnect () {
        this.connected = true

        if (this.keepReconnectInterval) {
            clearInterval(this.keepReconnectInterval)
        }

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: ConnectionStatusEnum.CONNECTED
        })

        this.eventsSdkClass.loggerClass.start().then(() => {
            this.eventsSdkClass.loggerClass.sdkConnectionSuccess()
        })
    }

    private onDisconnect (reason: Socket.DisconnectReason) {
        this.connected = false

        if (!this.doReconnect) {
            return
        }

        this.closeAllConnections()

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: this.doReconnect ? ConnectionStatusEnum.TRYING_TO_CONNECT : ConnectionStatusEnum.DISCONNECTED
        })

        this.eventsSdkClass.loggerClass.sdkDisconnect([ reason ])

        this.keepReconnectTimeout = setTimeout(
            () => {
                this.reconnectionTime = this.reconnectionTime + 20

                if (this.reconnectionTime > 120) {
                    this.reconnectionTime = 20
                }

                this.eventsSdkClass.connect(ServerParameter.NEXT)
            },
            this.reconnectionTime * 1000
        )
    }

    private onConnectError (data: Error) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: this.doReconnect ? ConnectionStatusEnum.TRYING_TO_CONNECT : ConnectionStatusEnum.DISCONNECTED
        })

        this.eventsSdkClass.loggerClass.sdkAttemptToConnectError(data)

        this.keepReconnectTimeout = setTimeout(
            () => {
                this.reconnectionTime = this.reconnectionTime + 20

                if (this.reconnectionTime > 60) {
                    this.reconnectionTime = 20
                }

                this.eventsSdkClass.connect(ServerParameter.NEXT)
            },
            this.reconnectionTime * 1000
        )
    }
}
