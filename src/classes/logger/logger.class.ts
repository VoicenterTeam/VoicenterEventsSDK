import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'

export class LoggerClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: Socket | undefined

    public init () {
        if (!this.eventsSdkClass.options.useLogger) {
            return
        }

        if (this.eventsSdkClass.options.loggerSocketConnection) {
            this.io = this.eventsSdkClass.options.loggerSocketConnection
        } else {
            if (this.eventsSdkClass.socketIoClass.ioFunction) {
                this.io = this.eventsSdkClass.socketIoClass.ioFunction(
                    this.eventsSdkClass.options.loggerServer,
                    this.eventsSdkClass.options.loggerConnectOptions as Partial<ManagerOptions & SocketOptions>
                )
            }
        }
    }
}