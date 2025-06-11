import type { EventsSdkOptionsMain } from '@/classes/events-sdk/events-sdk.types'

export const eventsSdkDefaultOptions: EventsSdkOptionsMain = {
    isNewStack: false,
    loginUrl: 'https://loginapi.voicenter.co.il/monitorAPI/Login',
    refreshTokenUrl: 'https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken',
    forceNew: true,
    /** Initial reconnection delay in seconds will be used as a base, and on each unsuccessfully attempt delay is exponentially increased */
    reconnectionDelay: 5,
    timeout: 10000,
    keepAliveTimeout: 60000,
    protocol: 'https',
    useLogger: true,
    loggerServer: 'https://socketlog.voicenter.co',
    loggerConfig: {
        logToConsole: true,
        overloadGlobalConsole: false,
        system: 'events-sdk', // ws-connection (should be like a subSystem)
        socketEmitInterval: 10000,
    },
    loggerConnectOptions: {
        reconnection: false,
        reconnectionDelay: 5000,
        reconnectionAttempts: 10,
        perMessageDeflate: undefined,
        upgrade: false,
        transports: [ 'websocket' ],
        debug: false
    },
}
