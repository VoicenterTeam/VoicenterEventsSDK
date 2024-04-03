import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { EventsEnum } from '@voicenter-team/real-time-events-types'
import { StorageClass } from '@/classes/storage/storage.class'
import { LoggerTypeEnum } from '@/enum/logger.enum'
import EventsHandler from '@/classes/socket-io/events-handler'
import { ServerListenerEventsEnum } from '@/enum/socket.enum'
import {
    OriginalAllDialersStatusEvent,
    OriginalAllExtensionStatusEvent,
    OriginalDialerEvent,
    OriginalExtensionEvent,
    OriginalExtensionsUpdated,
    OriginalKeepAliveResponseEvent,
    OriginalLoginStatusEvent,
    OriginalLoginSuccessEvent,
    OriginalQueueEvent
} from '@/types/realtime-events'

// import { LoggerTypeEnum } from '@/enum/logger.enum'

export class SocketIoClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    public lastEventTimestamp = new Date().getTime()
    public doReconnect = true
    private keepAliveInterval: ReturnType<typeof setInterval> | undefined
    private keepReconnectInterval: ReturnType<typeof setInterval> | undefined
    private connected = false

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

            this.eventsSdkClass.loggerClass.log(
                LoggerTypeEnum.INFO,
                'Connecting to..',
                url
            )

            this.eventsSdkClass.eventEmitterClass.emit(
                EventsEnum.ONLINE_STATUS_EVENT,
                {
                    isSocketConnected: false,
                    attemptToConnect: url
                }
            )

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

            if (token) {
                options.query = {
                    token
                }
            }

            if (this.ioFunction && url) {
                this.io = this.ioFunction(url, options)
            } else {
                throw new Error('Socket server url no defined')
            }
        } catch (error) {
            this.eventsSdkClass.loggerClass.log(LoggerTypeEnum.ERROR, 'init socket connection error', error)
        }
    }

    public clearKeepAliveInterval () {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }
    }

    public initKeepAlive () {
        this.clearKeepAliveInterval()

        this.keepAliveInterval = setInterval(async () => {
            const now = new Date().getTime()

            // if (now > this.lastEventTimestamp + delta) {
            //     this.eventsSdkClass.connect(ServerParameter.DEFAULT, true)
            //
            //     return
            // }
            //
            // if (!this.io) {
            //     this.initSocketConnection()
            //
            //     return
            // }

            if (now > this.lastEventTimestamp + this.eventsSdkClass.options.keepAliveTimeout && this.io && this.eventsSdkClass.authClass.token) {
                this.eventsSdkClass.emit(ServerListenerEventsEnum.KEEP_ALIVE, this.eventsSdkClass.authClass.token)

                this.eventsSdkClass.loggerClass.log(LoggerTypeEnum.INFO, `EMIT -> ${EventsEnum.KEEP_ALIVE}`, this.eventsSdkClass.authClass.token)

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

        StorageClass.clearSessionStorage()
    }

    public initSocketEvents () {
        if (!this.io) {
            return
        }

        this.io
            .on(EventsEnum.LOGIN_SUCCESS, (data) => this.onLoginSuccessEvent(data))
            .on(EventsEnum.QUEUE_EVENT, (data) => this.onQueueEvent(data))
            .on(EventsEnum.EXTENSION_EVENT, (data) => this.onExtensionEvent(data))
            .on(EventsEnum.DIALER_EVENT, (data) => this.onDialerEvent(data))
            .on(EventsEnum.LOGIN_STATUS, (data) => this.onLoginStatusEvent(data))
            .on(EventsEnum.ALL_EXTENSION_STATUS, (data) => this.onAllExtensionStatus(data))
            .on(EventsEnum.ALL_DIALER_STATUS, (data) => this.onAllDialerStatus(data))
            .on(EventsEnum.KEEP_ALIVE_RESPONSE, (data) => this.onKeepAliveResponse(data))
            .on(EventsEnum.EXTENSIONS_UPDATED, (data) => this.onExtensionsUpdatedEvent(data))
            .on(EventsEnum.CONNECT, () => this.onConnect())
            .on(EventsEnum.DISCONNECT, (data) => this.onDisconnect(data))
            .on(EventsEnum.CONNECT_ERROR_EVENT, (data) => this.onConnectError(data))
    }

    private onLoginSuccessEvent (data: OriginalLoginSuccessEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.LOGIN_SUCCESS, data)
    }

    private onQueueEvent (data: OriginalQueueEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.QUEUE_EVENT, data)
    }

    private onExtensionEvent (data: OriginalExtensionEvent) {
        const dataExtended = EventsHandler.mapExtensionEvent(data)

        if (dataExtended) {
            this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.EXTENSION_EVENT, dataExtended)
        }
    }

    private onDialerEvent (data: OriginalDialerEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.DIALER_EVENT, data)
    }

    private onLoginStatusEvent (data: OriginalLoginStatusEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.LOGIN_STATUS, data)
    }

    private onAllExtensionStatus (data: OriginalAllExtensionStatusEvent) {
        const dataExtended = EventsHandler.mapAllExtensionStatus(data)

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ALL_EXTENSION_STATUS, dataExtended)
    }

    private onAllDialerStatus (data: OriginalAllDialersStatusEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ALL_DIALER_STATUS, data)
    }

    private onKeepAliveResponse (data: OriginalKeepAliveResponseEvent) {
        this.eventsSdkClass.loggerClass.log(LoggerTypeEnum.INFO, EventsEnum.KEEP_ALIVE_RESPONSE)

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

    private onExtensionsUpdatedEvent (data: OriginalExtensionsUpdated) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.EXTENSIONS_UPDATED, data)
    }

    private onConnect () {
        if (this.keepReconnectInterval) {
            clearInterval(this.keepReconnectInterval)
        }

        this.connected = true

        this.eventsSdkClass.loggerClass.log(
            LoggerTypeEnum.INFO,
            EventsEnum.CONNECT,
            this.eventsSdkClass.reconnectOptions
        )

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, { isSocketConnected: true })
    }

    private onDisconnect (reason: Socket.DisconnectReason) {
        this.connected = false

        this.eventsSdkClass.loggerClass.log(
            LoggerTypeEnum.INFO,
            EventsEnum.DISCONNECT,
            reason
        )

        this.closeAllConnections()

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, { isSocketConnected: false })

        if (!this.doReconnect) {
            return
        }

        console.log('attempt to connect...')
        this.eventsSdkClass.connect(ServerParameter.NEXT)
    }

    private onConnectError (data: Error) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, { isSocketConnected: false })

        this.eventsSdkClass.loggerClass.log(
            LoggerTypeEnum.ERROR,
            EventsEnum.CONNECT_ERROR_EVENT,
            data
        )

        setTimeout(
            () => {
                this.eventsSdkClass.connect(ServerParameter.NEXT)
            },
            this.eventsSdkClass.options.reconnectionDelay
        )
    }
}
