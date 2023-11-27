import { EventsSdkOptions, Environment } from '@/classes/events-sdk/events-sdk'

export const eventsSdkDefaultOptions: EventsSdkOptions = {
    url: 'https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls',
    environment: Environment.BROWSER,
    fallbackServer: {
        Domain: 'monitor5.voicenter.co.il',
        Priority: 0,
    },
    loginUrl: 'https://loginapi.voicenter.co.il/monitorAPI/Login',
    refreshTokenUrl: 'https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken',
    // servers: defaultServers, // commented temporary
    token: '',
    loginType: 'token',
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
    store: '',
    extensionsModuleName: 'sdkExtensions',
    queuesModuleName: 'sdkQueues',
    dialersModuleName: 'sdkDialers',
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