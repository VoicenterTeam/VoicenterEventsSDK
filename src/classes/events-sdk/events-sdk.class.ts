import { eventsSdkDefaultOptions } from './events-sdk-default-options';
import { EventsSdkOptions, ReconnectOptions, Server } from './events-sdk.types';

class EventsSdkClass {
    constructor (private readonly options: EventsSdkOptions = {}) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        };

        this.argumentOptions = this.options;

        this.lastEventTimestamp = new Date().getTime();

        this.initReconnectOptions();
    }

    private argumentOptions: EventsSdkOptions;
    private server: Server;
    private connected = false;
    private connectionEstablished = false;
    private doConnectOnDisconnect = true;
    private lastEventTimestamp: number;
    private reconnectOptions: ReconnectOptions;
    private listenerMap = new Map();

    private initReconnectOptions () {
        this.reconnectOptions = {
            retryCount: 1,
            maxReconnectAttempts: this.options.maxReconnectAttempts,
            reconnectionDelay: this.options.reconnectionDelay,
            minReconnectionDelay: this.options.reconnectionDelay,
            maxReconnectionDelay: 60000 * 5
        };
    }
}

export default EventsSdkClass;