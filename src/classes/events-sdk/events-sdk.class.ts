import AuthClass from '@/classes/auth/auth.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import {
    EventsSdkOptionsBase,
    Server,
    ServerParameter
} from '@/classes/events-sdk/events-sdk.types'
import type {
    EventsSdkOptionsClient,
    EventsSdkOptionsMain
} from '@/classes/events-sdk/events-sdk.types'
import type {
    ServerEmitEventCallbackRegistry,
    ServerEmitEventTypeNames,
    SocketTyped
} from '@/types/socket'
import type {
    EventSpecificCallback,
    EventTypeNames,
    GenericEventWrapper,
} from '@/types/events'
import { LoggerClass } from '@/classes/logger/logger.class'
import { EventEmitterClass } from '@/classes/event-emitter/event-emitter.class'

class EventsSdkClass {
    public readonly options: EventsSdkOptionsMain & EventsSdkOptionsBase
    public servers: Server[] = []
    public URLList: string[] = []
    public server: Server | undefined
    public URL: string | undefined
    public socket: SocketTyped | undefined
    private mainServer: Server | undefined

    private alreadyAttemptedOtherServers: Array<number | string> = []

    public authClass = new AuthClass(this)
    public socketIoClass = new SocketIoClass(this)
    public loggerClass = new LoggerClass(this)
    public eventEmitterClass = new EventEmitterClass(this)

    constructor (options: EventsSdkOptionsClient) {
        this.options = {
            ...eventsSdkDefaultOptions,
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
        if (serverParameter === ServerParameter.MAIN) {
            this.findMainServer()
        }

        if (serverParameter === ServerParameter.NEXT) {
            this.findNextServer()
        }

        this.socketIoClass.doReconnect = true

        try {
            this.loggerClass.init()
        } catch (e) {
            console.error(e)
        }

        this.socketIoClass.initSocketConnection()

        this.socketIoClass.initSocketEvents()

        this.socketIoClass.initKeepAlive()
    }

    public disconnect () {
        this.socketIoClass.doReconnect = false

        this.socketIoClass.closeAllConnections()
        this.loggerClass.stop()
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
        if (this.servers.length && this.server) {
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
        const loginSessionData = await this.authClass.login()

        if (loginSessionData) {
            this.authClass.onLoginResponse(loginSessionData)
        }

        this.loggerClass.sdkInitializedLog()

        return true
    }

    public getCircularReplacer = () => {
        const seen = new WeakSet()
        return (key: string, value: object) => {
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

    public getCurrentMonitorServer (): Server | undefined {
        return this.server
    }
}

export default EventsSdkClass
