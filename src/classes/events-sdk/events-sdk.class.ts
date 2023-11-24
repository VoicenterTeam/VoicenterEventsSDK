import debounce from 'lodash/debounce'

import AuthClass from '../auth/auth.class'
import { eventsSdkDefaultOptions } from './events-sdk-default-options'
import { EventsSdkOptions, ReconnectOptions, Server, ServerParameter } from './events-sdk.types'
import { SocketIoOptions } from '../socket-io/socket-io.types'

class EventsSdkClass {
    constructor (private readonly options: EventsSdkOptions = {}) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        }

        this.argumentOptions = this.options

        this.initReconnectOptions()

        this.connect() // for test

        this.retryConnection = debounce(this.connect.bind(this), this.reconnectOptions.reconnectionDelay, {
            leading: true,
            trailing: false
        })
    }

    private argumentOptions: EventsSdkOptions
    private servers: Server[] = []
    private server: Server
    public socket = null
    private connected = false
    private connectionEstablished = false
    private doConnectOnDisconnect = true
    private reconnectOptions: ReconnectOptions
    private listenerMap = new Map()
    private retryConnection
    private token: string

    private initReconnectOptions () {
        this.reconnectOptions = {
            retryCount: 1,
            maxReconnectAttempts: this.options.maxReconnectAttempts,
            reconnectionDelay: this.options.reconnectionDelay,
            minReconnectionDelay: this.options.reconnectionDelay,
            maxReconnectionDelay: 60000 * 5
        }
    }

    private async connect (server: ServerParameter = ServerParameter.DEFAULT, skipLogin = false): Promise<void> {
        this.doConnectOnDisconnect = true

        let serverToConnect: Server = null

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

    private findNextAvailableServer (): Server | null {
        // this.log(INFO, 'Failover -> Trying to find another server');

        const currentServerPriority = this.server.Priority

        const nextServerPriority = currentServerPriority + 1

        const nextServer = this.servers.find(server => server.Priority === nextServerPriority) || this.findMaxPriorityServer()

        if (this.server.Domain !== nextServer.Domain) {
            this.server = { ...nextServer }

            // this.log(INFO, 'Failover -> Found new server. Connecting to it...', this.server);

            return this.server
        }

        return null
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
        
        return null
    }

    public init () {
        if (this.connectionEstablished) {
            return true
        }

        if (this.socket) {
            // this.emit(eventTypes.CLOSE);
        }

        // await this._getToken();

        // await this._getTabsSession();

        AuthClass.login(this.options)

        this.getServers()

        return true
    }

    private getServers () {
        if (this.options.serverFetchStrategy === 'static' && this.argumentOptions.servers && Array.isArray(this.argumentOptions.servers) && this.argumentOptions.servers.length > 1) {
            this.servers = this.argumentOptions.servers
        }
    }

    public getServerWithHighestPriority (servers: Server[]): Server {
        // Highest priority server is the one with lowest Priority value

        let chosenServer: Server

        let maxPriority = Number.MAX_SAFE_INTEGER

        servers.forEach(server => {
            if (server.Priority < maxPriority) {
                maxPriority = server.Priority

                chosenServer = server
            }
        })

        return chosenServer
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
                query: null
            }

            if (this.token) {
                options.query = {
                    token: this.token
                }
            }

            // allConnections.push(this.socket);
            
            this.connectionEstablished = true
        } catch (e) {
            // this.log(ERROR, e);
        }
    }
}

export default EventsSdkClass