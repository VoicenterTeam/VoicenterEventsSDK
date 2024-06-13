import { EventsSdkOptionsMain } from '@/classes/events-sdk/events-sdk.types'

export const eventsSdkDefaultOptions: EventsSdkOptionsMain = {
    isNewStack: false,
    loginUrl: 'https://loginapi.voicenter.co.il/monitorAPI/Login',
    refreshTokenUrl: 'https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken',
    forceNew: true,
    reconnectionDelay: 10000,
    // reconnectionDelayMax: 10000,
    // maxReconnectAttempts: 5,
    timeout: 10000,
    keepAliveTimeout: 60000,
    // idleInterval: 60000 * 5,
    protocol: 'https',
    // transports: [ 'websocket' ],
    // upgrade: false,
    // serverFetchStrategy: 'static',
    // serverType: 0,
    useLogger: true,
    loggerServer: 'https://socketlog.voicenter.co',
    loggerConfig: {
        logToConsole: true,
        overloadGlobalConsole: false,
        system: 'events-sdk',
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
