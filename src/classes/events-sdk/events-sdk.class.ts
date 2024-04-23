import AuthClass from '@/classes/auth/auth.class'
import { debounce } from 'lodash'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { EventsSdkOptions, ReconnectOptions, Server, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ServerEmitEventCallbackRegistry,
    ServerEmitEventTypeNames,
    SocketTyped
} from '@/types/socket'
import {
    EventSpecificCallback,
    EventTypeNames,
    GenericEventWrapper,
} from '@/types/events'
import { LoggerClass } from '@/classes/logger/logger.class'
import { EventEmitterClass } from '@/classes/event-emitter/event-emitter.class'
import { ActionNameEnum, LevelEnum, LogTypeEnum } from '@voicenter-team/socketio-storage-logger'

class EventsSdkClass{
    private argumentOptions: EventsSdkOptions
    public readonly options: EventsSdkOptions
    public servers: Server[] = []
    public URLList: string[] = []
    public server: Server
    public URL: string | undefined
    public socket: SocketTyped | undefined
    private mainServer: Server | undefined

    private alreadyAttemptedOtherServers: Array<number | string> = []

    public authClass = new AuthClass(this)
    public socketIoClass = new SocketIoClass(this)
    public loggerClass = new LoggerClass(this)
    public eventEmitterClass = new EventEmitterClass(this)

    public reconnectOptions: ReconnectOptions

    public retryConnection

    constructor (options: EventsSdkOptions) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        }

        this.reconnectOptions = {
            retryCount: 1,
            maxReconnectAttempts: this.options.maxReconnectAttempts,
            reconnectionDelay: this.options.reconnectionDelay, // 10 seconds. After each re-connection attempt this number will increase (minReconnectionDelay * attempts) => 10, 20, 30, 40 seconds ... up to 5min
            minReconnectionDelay: this.options.reconnectionDelay, // 10 seconds
            maxReconnectionDelay: 60000 * 5 // 5 minutes
        }

        this.server = this.options.fallbackServer

        this.retryConnection = debounce(this.connect.bind(this), this.reconnectOptions.reconnectionDelay, {
            leading: true,
            trailing: false
        })

        this.argumentOptions = {
            ...options
        }
    }

    public on<T extends EventTypeNames> (event: T, callback: EventSpecificCallback<T>): void
    public on (event: '*', callback: (data: GenericEventWrapper) => void): void

    public on (event: unknown, callback: unknown): void {
        this.eventEmitterClass.on(event, callback)
    }

    public emit <T extends ServerEmitEventTypeNames> (event: T, ...args: Parameters<ServerEmitEventCallbackRegistry[T]>) {
        if (this.socketIoClass.io) {
            this.socketIoClass.io.emit(event, ...args)
        }
    }

    public connect (serverParameter: ServerParameter) {
        // if (server === ServerParameter.DEFAULT) {
        //     serverToConnect = this.findCurrentServer()
        // }
        //
        // if (server === ServerParameter.NEXT) {
        //     serverToConnect = this.findNextAvailableServer()
        // }
        //
        // if (server === ServerParameter.PREVIOUS) {
        //     serverToConnect = this.findMaxPriorityServer()
        // }

        if (serverParameter === ServerParameter.MAIN) {
            this.findMainServer()
        }

        if (serverParameter === ServerParameter.NEXT) {
            this.findNextServer()
        }

        this.socketIoClass.doReconnect = true

        this.loggerClass.init()

        this.socketIoClass.initSocketConnection()

        this.socketIoClass.initSocketEvents()

        this.socketIoClass.initKeepAlive()
    }

    public disconnect () {
        this.socketIoClass.doReconnect = false
        this.socketIoClass.closeAllConnections()
    }

    public clearKeepAliveInterval () {
        this.socketIoClass.clearKeepAliveInterval()
    }

    private findMainServer () {
        if (this.servers.length) {
            this.mainServer = this.servers.reduce((prev, cur) => {
                return cur.Priority > prev.Priority ? cur : prev
            })

            this.server = this.mainServer
        } else {
            if (this.URLList.length) {
                this.URL = this.URLList[0]
            }
        }
    }

    private findNextServer () {
        if (this.servers.length) {
            if (this.server.Priority === this.mainServer!.Priority) {
                let filteredServers = this.servers.filter(
                    server =>
                        server.Priority !== this.mainServer!.Priority &&
                        this.alreadyAttemptedOtherServers.indexOf(server.Priority) + 1 === 0
                )

                if (!filteredServers.length) {
                    this.alreadyAttemptedOtherServers = []

                    filteredServers = this.servers.filter(
                        server =>
                            server.Priority !== this.mainServer!.Priority &&
                            this.alreadyAttemptedOtherServers.indexOf(server.Priority) + 1 === 0
                    )
                }

                if (filteredServers.length) {
                    this.server = filteredServers.reduce((prev, cur) => {
                        return cur.Priority > prev.Priority ? cur : prev
                    })

                    this.alreadyAttemptedOtherServers.push(this.server.Priority)
                }
            } else {
                this.server = this.mainServer!
            }
        } else {
            if (this.URLList.length) {
                if (this.URL === this.URLList[0]) {
                    let filteredServers = this.URLList.filter(
                        url =>
                            url !== this.URLList[0] &&
                            this.alreadyAttemptedOtherServers.indexOf(url) + 1 === 0
                    )

                    if (!filteredServers.length) {
                        this.alreadyAttemptedOtherServers = []

                        filteredServers = this.URLList.filter(
                            url =>
                                url !== this.URLList[0] &&
                                this.alreadyAttemptedOtherServers.indexOf(url) + 1 === 0
                        )
                    }

                    if (filteredServers.length) {
                        this.URL = filteredServers[0]

                        this.alreadyAttemptedOtherServers.push(this.URL)
                    }
                } else {
                    this.URL = this.URLList[0]
                }
            }
        }
    }

    public async init () {
        if (this.socket) {
            // this.emit(eventTypes.CLOSE);
        }

        await this.authClass.login(this.options)

        this.getServers()

        this.loggerClass.log({
            Message: `Sdk initialized with this options ${this.options}`,
            ActionName: ActionNameEnum.WSCONNECT,
            isShowClient: false,
            Status: 'Sdk initialized',
            StatusCode: 200,
            Level: LevelEnum.INFO,
            LogType: LogTypeEnum.INFO
        })


        return true
    }

    private getServers () {
        if (this.options.serverFetchStrategy === 'static' && this.argumentOptions.servers && Array.isArray(this.argumentOptions.servers) && this.argumentOptions.servers.length > 1) {
            this.servers = this.argumentOptions.servers
        }
    }
}

export default EventsSdkClass
