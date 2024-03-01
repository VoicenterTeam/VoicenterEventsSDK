import { Socket } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { LoggerTypeEnum } from '@/enum/logger.enum'
import { EventsEnum } from '@/enum/events.enum'
import StorageLogger from '@voicenter-team/socketio-storage-logger'

export class LoggerClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: Socket | undefined
    private storageLogger: StorageLogger | undefined

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
                    this.eventsSdkClass.options.loggerConnectOptions
                )
            }
        }

        if (this.io) {
            this.storageLogger = new StorageLogger({
                socket: this.io,
                loggerOptions: this.eventsSdkClass.options.loggerConfig
            })
        } else {
            this.storageLogger = new StorageLogger({
                url: this.eventsSdkClass.options.loggerServer,
                socketOptions: this.eventsSdkClass.options.loggerConnectOptions,
                loggerOptions: this.eventsSdkClass.options.loggerConfig
            })
        }
    }

    public log (type: LoggerTypeEnum, event: EventsEnum | string, ...data: unknown[]) {
        const result = [ event, ...data ]
        if (this.storageLogger) {
            if (type === LoggerTypeEnum.INFO) {
                this.storageLogger.log(result)
            } else if (type === LoggerTypeEnum.ERROR) {
                this.storageLogger.error(result)
            }
        } else {
            if (type === LoggerTypeEnum.INFO) {
                console.log(result)
            } else if (type === LoggerTypeEnum.ERROR) {
                console.error(result)
            }
        }
    }
}
