import { EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'

export const eventsSdkDefaultOptions: Partial<EventsSdkOptions> = {
    isNewStack: false,
    forceNew: true,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 10000,
    maxReconnectAttempts: 5,
    timeout: 10000,
    keepAliveTimeout: 60000,
    idleInterval: 60000 * 5,
    protocol: 'https',
    transports: [ 'websocket' ],
    upgrade: false,
    serverFetchStrategy: 'static',
    serverType: 0,
    useLogger: false,
    loggerSocketConnection: '',
    loggerServer: 'http://127.0.0.1:3000/',
    loggerConfig: {
        logToConsole: true,
        overloadGlobalConsole: false,
        namespace: 'events-sdk',
        socketEmitInterval: 10000,
    },
    loggerConnectOptions: {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 10,
        perMessageDeflate: false,
        upgrade: false,
        transports: [ 'websocket' ],
        debug: false
    },
}
