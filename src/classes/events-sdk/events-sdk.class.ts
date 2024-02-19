import AuthClass from '@/classes/auth/auth.class'
import { debounce } from 'lodash'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { EventsSdkOptions, ReconnectOptions, Server, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { SocketTyped } from '@/types/socket'
import {
    EventCallbackListenersMap,
    EventSpecificCallback,
    EventTypeData,
    EventTypeNames,
    GenericEventWrapper,
} from '@/types/events'
import { EventsEnum } from '@/enum/events.enum'
import { LoggerClass } from '@/classes/logger/logger.class'

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

    public reconnectOptions: ReconnectOptions

    public retryConnection

    private listeners: EventCallbackListenersMap = {
        [EventsEnum.ALL_EXTENSION_STATUS]: [],
        [EventsEnum.ALL_DIALER_STATUS]: [],
        [EventsEnum.ALL_USERS_STATUS]: [],
        [EventsEnum.QUEUE_EVENT]: [],
        [EventsEnum.EXTENSION_EVENT]: [],
        [EventsEnum.DIALER_EVENT]: [],
        [EventsEnum.LOGIN_SUCCESS]: [],
        [EventsEnum.LOGIN_STATUS]: [],
        [EventsEnum.KEEP_ALIVE_RESPONSE]: [],
        [EventsEnum.ONLINE_STATUS_EVENT]: []
    }
    private allListeners: Array<(data: GenericEventWrapper) => void> = []

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
    public on (event: unknown, callback: unknown) {
        if (event === '*') {
            this.allListeners.push(callback as (data: GenericEventWrapper) => void)
        } else {
            // Handle specific event type with strong typing
            this.listeners[event as EventTypeNames].push(callback as EventSpecificCallback<EventTypeNames>)
        }
    }

    public off<T extends EventTypeNames> (event: T, callback: EventSpecificCallback<T>): void
    public off (event: '*', callback: (data: GenericEventWrapper) => void): void
    public off (event: unknown, callback: unknown) {
        if (event === '*') {
            this.allListeners = this.allListeners.filter(item => item !== callback)
        } else {
            const data = this.listeners[event as EventTypeNames] as Array<EventSpecificCallback<EventTypeNames>>
            const filtered = data.filter(item => item !== callback)

            this.listeners = {
                ...this.listeners,
                [event as EventTypeNames]: filtered
            }
        }
    }

    public emit <T extends EventTypeNames> (event: T, data: EventTypeData<T>) {
        this.socketIoClass.lastEventTimestamp = new Date().getTime()

        this.listeners[event].forEach(callback => callback({
            name: event,
            data
        }))

        const allEventData: GenericEventWrapper = {
            name: event,
            data: data as any
        }

        this.allListeners.forEach((callback) => callback(allEventData))
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

    public getServerWithHighestPriority (servers: Server[]): Server {
        let chosenServer: Server | undefined

        let maxPriority = Number.MAX_SAFE_INTEGER

        chosenServer = servers.find(server => {
            if (server.Priority < maxPriority) {
                maxPriority = server.Priority

                chosenServer = server
            }
        })

        return chosenServer ? chosenServer : this.server
    }

    public async init () {
        if (this.socket) {
            // this.emit(eventTypes.CLOSE);
        }

        await this.authClass.login(this.options)

        this.getServers()

        return true
    }

    private getServers () {
        if (this.options.serverFetchStrategy === 'static' && this.argumentOptions.servers && Array.isArray(this.argumentOptions.servers) && this.argumentOptions.servers.length > 1) {
            this.servers = this.argumentOptions.servers
        }
    }
}

export default EventsSdkClass
