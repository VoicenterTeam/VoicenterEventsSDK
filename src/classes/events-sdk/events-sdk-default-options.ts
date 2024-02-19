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
    useLogger: true,
    loggerServer: 'http://socketlog.voicenter.co',
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
        perMessageDeflate: undefined,
        upgrade: false,
        transports: [ 'websocket' ],
        debug: false
    },
}
