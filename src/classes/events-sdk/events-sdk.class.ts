import AuthClass from '@/classes/auth/auth.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { SocketIoOptions } from '@/classes/socket-io/socket-io'
import { ServerParameter, EventsSdkOptions, Server } from '@/classes/events-sdk/events-sdk.types'
import { SocketTyped } from '@/types/socket'

class EventsSdkClass {
    constructor (private readonly options: EventsSdkOptions) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        }

        this.server = this.options.fallbackServer

        this.argumentOptions = {
            ...options
        }

        // this.reconnectOptions = this.initReconnectOptions()

        // this.retryConnection = debounce(this.connect.bind(this), this.reconnectOptions.reconnectionDelay, {
        //     leading: true,
        //     trailing: false
        // })
    }

    private argumentOptions: EventsSdkOptions
    private servers: Server[] = []
    private server: Server
    public socket: SocketTyped | undefined
    // private connected = false
    // private reconnectOptions: ReconnectOptions
    // private listenerMap = new Map()
    // private retryConnection
    private token = ''
    private authClass = new AuthClass(this)

    // private initReconnectOptions (): ReconnectOptions {
    //     return {
    //         retryCount: 1,
    //         maxReconnectAttempts: this.options.maxReconnectAttempts,
    //         reconnectionDelay: this.options.reconnectionDelay,
    //         minReconnectionDelay: this.options.reconnectionDelay,
    //         maxReconnectionDelay: 60000 * 5
    //     }
    // }

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

        this.initSocketConnection()

        // this._initSocketEvents();

        // this._initKeepAlive();

        // this._initReconnectDelays();

        if (skipLogin) {
            return
        }

        // await this.login(this.options.loginType);
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

        // await this._getToken();

        // await this._getTabsSession();

        this.authClass.login(this.options)

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

    private initSocketConnection () {
        try {
            // const domain = this.server.Domain;
            //
            // const protocol = this.options.protocol;
            //
            // const url = `${protocol}://${domain}`;

            // this.log(INFO, 'Connecting to..', url);

            // this.closeAllConnections();

            const options: SocketIoOptions = {
                reconnection: false,
                perMessageDeflate: false,
                upgrade: false,
                transports: [ 'websocket' ],
                debug: false,
                query: {
                    token: ''
                }
            }

            if (this.token) {
                options.query = {
                    token: this.token
                }
            }

            // allConnections.push(this.socket);
        } catch (e) {
            // this.log(ERROR, e);
        }
    }
}

export default EventsSdkClass
