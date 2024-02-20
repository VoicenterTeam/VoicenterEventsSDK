import { Socket } from 'socket.io-client'
import { AsyncStorageLogger } from '@voicenter-team/socketio-storage-logger/build/AsyncStorageLogger'
// import {
//     AsyncStorageLoggerConfig
// } from '@voicenter-team/socketio-storage-logger/build/interfaces/AsyncStorageLoggerConfig'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { LoggerTypeEnum } from '@/enum/logger.enum'
import { EventsEnum } from '@/enum/events.enum'
// import { StorageClass } from '@/classes/storage/storage.class'

export class LoggerClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: Socket | undefined
    private storageLogger: AsyncStorageLogger | undefined

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
            // this.storageLogger = new AsyncStorageLogger({
            //     ...this.eventsSdkClass.options.loggerConfig as AsyncStorageLoggerConfig,
            //     socketConnection: this.io,
            //     getItem: async (key: string) => {
            //         const result = await StorageClass.getSessionStorageDataByKey(key, false)
            //
            //         if (result === undefined) {
            //             return null
            //         }
            //
            //         return result
            //     },
            //     setItem (key: string, value: string) {
            //         return StorageClass.updateSessionStorageKey(key, value)
            //     }
            // })
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
