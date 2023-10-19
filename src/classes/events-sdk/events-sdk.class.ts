import debounce from 'lodash/debounce';

import { eventsSdkDefaultOptions } from './events-sdk-default-options';
import { EventsSdkOptions, ReconnectOptions, Server, ServerParameter } from './events-sdk.types';

class EventsSdkClass {
    constructor (private readonly options: EventsSdkOptions = {}) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        };

        this.argumentOptions = this.options;

        this.lastEventTimestamp = new Date().getTime();

        this.initReconnectOptions();

        this.retryConnection = debounce(this.connect.bind(this), this.reconnectOptions.reconnectionDelay, {
            leading: true,
            trailing: false
        });
    }

    private argumentOptions: EventsSdkOptions;
    private server: Server;
    private connected = false;
    private connectionEstablished = false;
    private doConnectOnDisconnect = true;
    private lastEventTimestamp: number;
    private reconnectOptions: ReconnectOptions;
    private listenerMap = new Map();
    private retryConnection;

    private initReconnectOptions () {
        this.reconnectOptions = {
            retryCount: 1,
            maxReconnectAttempts: this.options.maxReconnectAttempts,
            reconnectionDelay: this.options.reconnectionDelay,
            minReconnectionDelay: this.options.reconnectionDelay,
            maxReconnectionDelay: 60000 * 5
        };
    }

    private async connect (server: ServerParameter = ServerParameter.DEFAULT, skipLogin = false): Promise<void> {
        this.doConnectOnDisconnect = true;

        // let serverToConnect = null;

        if (server === ServerParameter.DEFAULT) {
            // serverToConnect = this._findCurrentServer();
        }

        if (server === ServerParameter.NEXT) {
            // serverToConnect = this._findNextAvailableServer();
        }

        if (server === ServerParameter.PREVIOUS) {
            // serverToConnect = this._findMaxPriorityServer();
        }

        // if (!serverToConnect) {
        // this.server = this._findCurrentServer();
        // }

        // this._initSocketConnection();

        // this._initSocketEvents();

        // this._initKeepAlive();

        // this._initReconnectDelays();

        if (skipLogin) {
            return;
        }

        // await this.login(this.options.loginType);
    }
}

export default EventsSdkClass;