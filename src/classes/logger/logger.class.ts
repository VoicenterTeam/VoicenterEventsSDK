import { Socket } from 'socket.io-client'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import type { LoggerDataPartial } from '@voicenter-team/socketio-storage-logger'
import StorageLogger, { ActionNameEnum, LevelEnum, LogTypeEnum } from '@voicenter-team/socketio-storage-logger'
import { LoginType } from '@/enum/auth.enum'
import type {
    EventsEnum,
    KeepAliveResponseEvent
} from '@voicenter-team/real-time-events-types'
import { DebugOption } from '@/enum/events-sdk.enum'
import { BootstrapLogData } from '@/classes/logger/logger.types'

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

    async start () {
        if (!this.storageLogger) {
            return
        }

        await this.storageLogger.start()
    }

    stop () {
        if (!this.storageLogger) {
            return
        }

        this.storageLogger.stop()
    }

    public log (data: LoggerDataPartial) {
        if (this.eventsSdkClass.options.useLogger) {
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
    }

    public sdkConnectionSuccess () {
        const replacedOptions = {
            ...this.eventsSdkClass.options,
            token: 'CENSORED',
            password: 'CENSORED'
        }

        this.log({
            Message: `Sdk connected to the socket server ${this.eventsSdkClass.server && this.eventsSdkClass.server.Domain ? this.eventsSdkClass.server.Domain : this.eventsSdkClass.URL}`,
            Body: JSON.stringify(replacedOptions, this.eventsSdkClass.getCircularReplacer()),
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection established',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    public sdkDisconnect (reasons: string[]) {
        this.log({
            Message: `Sdk disconnected from the socket server ${this.eventsSdkClass.server && this.eventsSdkClass.server.Domain ? this.eventsSdkClass.server.Domain : this.eventsSdkClass.URL} (${reasons})`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection closed',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    public sdkAttemptToConnect (domain?: string) {
        this.log({
            Message: `${this.eventsSdkClass.options.loggerConfig.system} is trying to connect to WS server ${domain}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Switching Protocols',
            StatusCode: 101,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    public sdkAttemptToConnectError (error: Error) {
        this.log({
            Message: `${error}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Connection error',
            StatusCode: 500,
            Level: LevelEnum.ERROR,
            LogType: LogTypeEnum.ERROR
        })
    }

    public loginError (loginType: LoginType, statusCode?: number, token?: string, email?: string,) {
        this.log({
            Message: `External login request error with the login type ${loginType} ${loginType === LoginType.TOKEN ? token : email}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'External login error',
            StatusCode: statusCode ? statusCode : 400,
            Level: LevelEnum.ERROR,
            LogType: LogTypeEnum.ERROR
        })
    }

    public getSettingsError (token: string, error: Error) {
        this.log({
            Message: `Get settings error with token ${token}, error: ${error}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Get settings error',
            StatusCode: 400,
            Level: LevelEnum.ERROR,
            LogType: LogTypeEnum.ERROR
        })
    }

    public refreshTokenError (oldRefreshToken: string, refreshTokenUrl: string, error: Error) {
        this.log({
            Message: `Refresh token error with old refresh token ${oldRefreshToken}, url: ${refreshTokenUrl}, error: ${error}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Get settings error',
            StatusCode: 400,
            Level: LevelEnum.ERROR,
            LogType: LogTypeEnum.ERROR
        })
    }

    public keepAliveEmit () {
        this.log({
            Message: `Keep alive event emitted with this token: ${this.eventsSdkClass.authClass.token}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    public keepAliveResponse (data: KeepAliveResponseEvent) {
        this.log({
            Message: `Keep alive response: ${JSON.stringify(data)}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Successful',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })
    }

    public bootstrapLog<T extends EventsEnum.ALL_EXTENSION_STATUS | EventsEnum.ALL_DIALER_STATUS> (
        eventName: T,
        data: BootstrapLogData[T]
    ) {
        if (
            this.eventsSdkClass.options.debugOption &&
            (this.eventsSdkClass.options.debugOption === DebugOption.BOOTSTRAP || this.eventsSdkClass.options.debugOption === DebugOption.FULL)
        ) {
            this.log({
                Message: `Event name: ${eventName}`,
                Body: JSON.stringify(data),
                ActionName: ActionNameEnum.WSCONNECT,
                isShowClient: false,
                Status: 'Successful',
                Level: LevelEnum.INFO,
                LogType: LogTypeEnum.INFO
            })
        }
    }
}
