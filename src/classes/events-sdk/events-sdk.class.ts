import AuthClass from '@/classes/auth/auth.class'
import sockets from '@/classes/socket-io/versions'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { ServerParameter, EventsSdkOptions, Server } from '@/classes/events-sdk/events-sdk.types'
import { SocketTyped } from '@/types/socket'

class EventsSdkClass {
    constructor (public readonly options: EventsSdkOptions) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        }

        this.server = this.options.fallbackServer

        this.argumentOptions = {
            ...options
        }
    }

    private argumentOptions: EventsSdkOptions
    private servers: Server[] = []
    private server: Server
    public socket: SocketTyped | undefined
    private authClass = new AuthClass(this)
    private socketIoClass = new SocketIoClass()

    public connect (server: ServerParameter = ServerParameter.DEFAULT, skipLogin = false) {
        let serverToConnect: Server | undefined

        if (server === ServerParameter.DEFAULT) {
            serverToConnect = this.findCurrentServer()
        }

        if (server === ServerParameter.NEXT) {
            serverToConnect = this.findNextAvailableServer()
        }

        if (server === ServerParameter.PREVIOUS) {
            serverToConnect = this.findMaxPriorityServer()
        }

        if (!serverToConnect) {
            this.server = this.findCurrentServer()
        }

        if (this.authClass.token && this.options.protocol) {
            console.log('initSocketConnection...')
            this.socketIoClass.initSocketConnection(this.authClass.token, this.options.protocol)
        }

        if (skipLogin) {
            return
        }
    }

    private findCurrentServer () {
        if (this.servers.length) {
            this.server = this.servers[0]
        }
        if (!this.server) {
            this.server = this.options.fallbackServer
        }
        return this.server
    }

    private findNextAvailableServer (): Server {
        // this.log(INFO, 'Failover -> Trying to find another server');

        const currentServerPriority = this.server.Priority

        const nextServerPriority = currentServerPriority + 1

        const nextServer = this.servers.find(server => server.Priority === nextServerPriority) || this.findMaxPriorityServer()

        this.server = { ...nextServer }

        // this.log(INFO, 'Failover -> Found new server. Connecting to it...', this.server);

        return this.server
    }

    private findMaxPriorityServer () {
        // this.log(INFO, 'Fallback -> Trying to find previous server');

        const maxPriorityServer = this.getServerWithHighestPriority(this.servers)

        if (!this.server) {
            this.server = maxPriorityServer

            return this.server
        }

        if (this.server && maxPriorityServer.Domain !== this.server.Domain) {
            this.server = maxPriorityServer

            // this.log(INFO, 'Fallback -> Trying to find previous server');

            return this.server
        }

        return this.server
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

    public getSocketIoFunction (Client: string) {
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.socketIoClass.ioFunction = sockets.getSocketVersion(version)
    }
}

export default EventsSdkClass
