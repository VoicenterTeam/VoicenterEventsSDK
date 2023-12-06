import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Environment, Server, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { EventsEnum } from '@/enum/events.enum'
import { KeepAliveResponseData } from '@/types/events'

export class SocketIoClass {
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    private allConnections: Socket[] = []
    private lastEventTimestamp = new Date().getTime()
    private keepAliveInterval: ReturnType<typeof setInterval> | undefined
    private connected = false

    public getSocketIoFunction (Client: string) {
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    public initSocketConnection (token: string, protocol: string, server: Server) {
        try {
            const domain = server.Domain

            const url = `${protocol}://${domain}`

            // this.log(INFO, 'Connecting to..', url);

            this.closeAllConnections()

            const options: Partial<ManagerOptions & SocketOptions> = {
                reconnection: false,
                upgrade: false,
                transports: [ 'websocket' ],
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

                this.allConnections.push(this.io)
            }

            // allConnections.push(this.socket);
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
        }
    }

    public initKeepAlive (token: string, protocol: string, server: Server) {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval)
        }

        this.keepAliveInterval = setInterval(async () => {
            const now = new Date().getTime()

            const delta = this.eventsSdkClass.options.keepAliveTimeout

            if (now > this.lastEventTimestamp + delta) {
                this.eventsSdkClass.connect(ServerParameter.NEXT, true)

                return
            }

            if (!this.io) {
                this.initSocketConnection(token, protocol, server)

                return
            }

            if (this.io) {
                this.io.emit(EventsEnum.KEEP_ALIVE, 'nyc06xfnAkAuRBul9Xe1TcAmrHm3m6BWkrj0ZasyBFkp89iae7Df3S4udqurnx2E0LTYbBsZxpcgzrjsorgFWQSWSW2xK4rWfg5k')

                return
            }

        }, this.eventsSdkClass.options.keepAliveTimeout)
    }

    public closeAllConnections () {
        this.allConnections.forEach(connection => {
            connection.close()
            connection.disconnect()
        })

        this.allConnections = []

        if (this.io) {
            this.io.close()
            this.io.disconnect()
            this.io = undefined
        }

        if (this.eventsSdkClass.options.environment === Environment.BROWSER && window) {
            window.sessionStorage.clear()
        }
        // if (options.environment === Environment.CHROME_EXTENSION && chrome) {
        //     chrome.storage.session.clear()
        // }
    }

    private onKeepAliveResponse (data: KeepAliveResponseData) {
        if (data.errorCode && this.eventsSdkClass.authClass.token) {
            this.initSocketConnection(this.eventsSdkClass.authClass.token, this.eventsSdkClass.options.protocol, this.eventsSdkClass.server)

            return
        }

        if (this.connected) {
            this.lastEventTimestamp = new Date().getTime()
        } else {
            if (this.eventsSdkClass.authClass.token) {
                this.initSocketConnection(this.eventsSdkClass.authClass.token, this.eventsSdkClass.options.protocol, this.eventsSdkClass.server)
            }
        }
    }
}
