import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ConnectionStatusEnum,
    EventsEnum
} from '@voicenter-team/real-time-events-types'
import type {
    AllDialersStatusEvent,
    AllExtensionStatusEvent,
    DialerEvent,
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
import { ActionNameEnum, LevelEnum, LogTypeEnum } from '@voicenter-team/socketio-storage-logger'

// import { LoggerTypeEnum } from '@/enum/logger.enum'

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

            this.eventsSdkClass.eventEmitterClass.emit(
                EventsEnum.ONLINE_STATUS_EVENT,
                {
                    attemptToConnect: url,
                    connectionStatus: ConnectionStatusEnum.TRYING_TO_CONNECT
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

                this.eventsSdkClass.loggerClass.log({
                    Message: `${this.eventsSdkClass.options.loggerConfig.system} is trying to connect to WS server ${domain}`,
                    ActionName: ActionNameEnum.WSCONNECT,
                    isShowClient: false,
                    Status: 'Switching Protocols',
                    StatusCode: 101,
                    Level: LevelEnum.INFO,
                    LogType: LogTypeEnum.INFO
                })
            } else {
                throw new Error('Socket server url no defined')
            }
        } catch (error) {
            this.eventsSdkClass.loggerClass.log({
                Message: `${error}`,
                ActionName: ActionNameEnum.WSCONNECT,
                isShowClient: false,
                Status: 'Connection error',
                StatusCode: 500,
                Level: LevelEnum.ERROR,
                LogType: LogTypeEnum.ERROR
            })
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

                this.eventsSdkClass.loggerClass.log({
                    Message: `Keep alive event emitted with this token: ${this.eventsSdkClass.authClass.token}`,
                    ActionName: ActionNameEnum.WSCONNECT,
                    isShowClient: false,
                    Level: LevelEnum.INFO,
                    LogType: LogTypeEnum.INFO
                })

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

    private onLoginSuccessEvent (data: LoginSuccessEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.LOGIN_SUCCESS, data)
    }

    private onQueueEvent (data: QueueEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.QUEUE_EVENT, EventsHandler.mapQueueEvent(data))
    }

    private onExtensionEvent (data: ExtensionEvent) {
        const dataExtended = EventsHandler.mapExtensionEvent(data)

        if (dataExtended) {
            this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.EXTENSION_EVENT, dataExtended)
        }
    }

    private onDialerEvent (data: DialerEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.DIALER_EVENT, data)
    }

    private onLoginStatusEvent (data: LoginStatusEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.LOGIN_STATUS, data)
    }

    private onAllExtensionStatus (data: AllExtensionStatusEvent) {
        const dataExtended = EventsHandler.mapAllExtensionStatus(data)

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ALL_EXTENSION_STATUS, dataExtended)
    }

    private onAllDialerStatus (data: AllDialersStatusEvent) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ALL_DIALER_STATUS, data)
    }

    private onKeepAliveResponse (data: KeepAliveResponseEvent) {
        if (data.errorCode) {
            this.initSocketConnection()

            return
        }

        this.eventsSdkClass.loggerClass.log({
            Message: `Keep alive response: ${JSON.stringify(data)}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Successful',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })

        if (this.connected) {
            this.lastEventTimestamp = new Date().getTime()
        } else {
            this.initSocketConnection()
        }
    }

    private onExtensionsUpdatedEvent (data: ExtensionsUpdated) {
        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.EXTENSIONS_UPDATED, data)
    }

    private onConnect () {
        if (this.keepReconnectInterval) {
            clearInterval(this.keepReconnectInterval)
        }

        this.connected = true

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: ConnectionStatusEnum.CONNECTED
        })

        this.eventsSdkClass.loggerClass.log({
            Message: `Sdk connected to the socket server ${this.eventsSdkClass.server && this.eventsSdkClass.server.Domain ? this.eventsSdkClass.server.Domain : this.eventsSdkClass.URL}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection established',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    private onDisconnect (reason: Socket.DisconnectReason) {
        this.connected = false

        this.closeAllConnections()

        this.eventsSdkClass.eventEmitterClass.emit(EventsEnum.ONLINE_STATUS_EVENT, {
            connectionStatus: this.doReconnect ? ConnectionStatusEnum.TRYING_TO_CONNECT : ConnectionStatusEnum.DISCONNECTED
        })

        this.eventsSdkClass.loggerClass.log({
            Message: `Sdk disconnected from the socket server ${this.eventsSdkClass.server && this.eventsSdkClass.server.Domain ? this.eventsSdkClass.server.Domain : this.eventsSdkClass.URL} (${reason})`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection closed',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })

        if (!this.doReconnect) {
            return
        }

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

        this.eventsSdkClass.loggerClass.log({
            Message: `Sdk attempt to connect to the socket server ${this.eventsSdkClass.URL} failed (${data})`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection attempt error',
            StatusCode: 500,
            Level: LevelEnum.ERROR,
            LogType: LogTypeEnum.ERROR
        })

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
