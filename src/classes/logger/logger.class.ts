import { Socket } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import StorageLogger, {
    ActionNameEnum,
    LevelEnum,
    LoggerDataPartial,
    LogTypeEnum
} from '@voicenter-team/socketio-storage-logger'
import { EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'

export class LoggerClass {
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
            if (data.Level === LevelEnum.INFO) {
                this.storageLogger.log(data)
            } else if (data.Level === LevelEnum.ERROR) {
                this.storageLogger.error(data)
            }
        } else {
            if (data.Level === LevelEnum.INFO) {
                console.log(data)
            } else if (data.Level === LevelEnum.ERROR) {
                console.error(data)
            }
        }
    }

    public sdkInitializedLog (options: EventsSdkOptions) {
        const replacedOptions = {
            ...options,
            token: 'CENSORED',
            password: 'CENSORED'
        }

        const getCircularReplacer = () => {
            const seen = new WeakSet()
            return (key: any, value: any) => {
                // Custom handling for specific circular references
                if (key === 'socket' || key === 'io' || key === 'nsps') {
                    return undefined
                }

                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return
                    }
                    seen.add(value)
                }
                return value
            }
        }

        this.log({
            Message: 'Sdk initialized with provided options',
            Body: JSON.stringify(replacedOptions, getCircularReplacer()),
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Sdk initialized',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }
}
