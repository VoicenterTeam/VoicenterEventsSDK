import { Socket } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { LoggerTypeEnum } from '@/enum/logger.enum'
import StorageLogger, { LoggerDataPartial } from '@voicenter-team/socketio-storage-logger'

export class LoggerClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    private storageLogger: StorageLogger | undefined

    public init () {
        if (!this.eventsSdkClass.options.useLogger) {
            return
        }

        if (this.eventsSdkClass.options.storageLoggerInstance) {
            this.storageLogger = this.eventsSdkClass.options.storageLoggerInstance

            return
        }

        let socket: Socket | undefined

        if (this.eventsSdkClass.options.loggerSocketConnection) {
            socket = this.eventsSdkClass.options.loggerSocketConnection
        }

        if (this.eventsSdkClass.socketIoClass.ioFunction && !socket) {
            socket = this.eventsSdkClass.socketIoClass.ioFunction(
                this.eventsSdkClass.options.loggerServer,
                this.eventsSdkClass.options.loggerConnectOptions
            )
        }

        if (socket) {
            this.storageLogger = new StorageLogger<LoggerDataPartial>({
                socket,
                loggerOptions: this.eventsSdkClass.options.loggerConfig
            })
        }
    }

    public log (data: LoggerDataPartial) {
        if (this.storageLogger) {
            if (data.Level === LoggerTypeEnum.INFO) {
                this.storageLogger.log(data)
            } else if (data.Level === LoggerTypeEnum.ERROR) {
                this.storageLogger.error(data)
            }
        } else {
            if (data.Level === LoggerTypeEnum.INFO) {
                console.log(data)
            } else if (data.Level === LoggerTypeEnum.ERROR) {
                console.error(data)
            }
        }
    }
}
