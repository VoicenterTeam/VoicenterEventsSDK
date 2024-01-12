import { ManagerOptions, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Environment, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { EventsEnum } from '@/enum/events.enum'
import { KeepAliveResponseEvent } from '@/types/events'

export class SocketIoClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    public lastEventTimestamp = new Date().getTime()
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
            const domain = server.Domain

            const url = `${protocol}://${domain}`

            // this.log(INFO, 'Connecting to..', url);

            const options: Partial<ManagerOptions & SocketOptions> = {
                reconnection: false,
                upgrade: false,
                transports: [ 'websocket' ],
                forceNew: true,
                query: {
                    token
                }
            }

            if (token) {
                options.query = {
                    token
                }
            }

            if (this.ioFunction) {
                this.io = this.ioFunction(url, options)
            }
        } catch (e) {
            // this.log(ERROR, e);
        }
    }

    public initSocketEvents () {
        if (this.io) {
            this.io
                .on(EventsEnum.LOGIN_SUCCESS, (data) => this.eventsSdkClass.emit(EventsEnum.LOGIN_SUCCESS, data))
                .on(EventsEnum.QUEUE_EVENT, (data) => this.eventsSdkClass.emit(EventsEnum.QUEUE_EVENT, data))
                .on(EventsEnum.EXTENSION_EVENT, (data) => this.eventsSdkClass.emit(EventsEnum.EXTENSION_EVENT, data))
                .on(EventsEnum.LOGIN_STATUS, (data) => this.eventsSdkClass.emit(EventsEnum.LOGIN_STATUS, data))
                .on(EventsEnum.ALL_EXTENSION_STATUS, (data) => this.eventsSdkClass.emit(EventsEnum.ALL_EXTENSION_STATUS, data))
                .on(EventsEnum.ALL_DIALER_STATUS, (data) => this.eventsSdkClass.emit(EventsEnum.ALL_DIALER_STATUS, data))
                .on(EventsEnum.KEEP_ALIVE_RESPONSE, (data) => this.onKeepAliveResponse(data))
                .on(EventsEnum.CONNECT, () => this.onConnect())
                .on(EventsEnum.DISCONNECT, () => this.onDisconnect())
        }
    }

    public initKeepAlive () {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }

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

            if (now > this.lastEventTimestamp + this.eventsSdkClass.options.keepAliveTimeout && this.io) {
                this.io.emit(EventsEnum.KEEP_ALIVE, this.eventsSdkClass.authClass.token)

                return
            }

        }, this.eventsSdkClass.options.keepAliveTimeout)
    }

    public closeAllConnections () {
        if (this.io) {
            this.io.close()

            this.io.disconnect()

            this.io = undefined
        }

        if (this.eventsSdkClass.options.environment === Environment.BROWSER && window) {
            window.sessionStorage.clear()
        }
        if (this.eventsSdkClass.options.environment === Environment.CHROME_EXTENSION && chrome) {
            chrome.storage.session.clear()
        }
    }

    private onKeepAliveResponse (data: KeepAliveResponseEvent) {
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

    private onConnect () {
        console.log('connected')

        if (this.keepReconnectInterval) {
            clearInterval(this.keepReconnectInterval)
        }

        this.connected = true
    }

    private onDisconnect () {
        console.log('disconnected')

        this.connected = false

        this.closeAllConnections()

        this.keepReconnectInterval = setInterval(() => {
            console.log('attempt to connect...')
            this.eventsSdkClass.connect(ServerParameter.NEXT, true)
        }, 15000)
    }
}
