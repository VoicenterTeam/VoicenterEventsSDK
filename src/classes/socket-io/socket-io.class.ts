import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Server } from '@/classes/events-sdk/events-sdk.types'
import { ManagerOptions, SocketOptions } from 'socket.io-client'
import { EventsEnum } from '@/enum/events.enum'

export class SocketIoClass {
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined

    public initSocketConnection (token: string, protocol: string, server: Server) {
        try {
            const domain = server.Domain

            const url = `${protocol}://${domain}`

            // this.log(INFO, 'Connecting to..', url);

            // this.closeAllConnections()

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
        }
    }
}
