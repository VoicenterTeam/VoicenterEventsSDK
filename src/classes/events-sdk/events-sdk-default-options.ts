import { EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'

export const eventsSdkDefaultOptions: EventsSdkOptions = {
    isNewStack: false,
    servers: [ {
        URLID: 1,
        Priority: 5,
        Version: '1.3.7',
        Domain: 'monitor1.comms24x7.com' 
    },{
        URLID: 2,
        Priority: 4,
        Version: '1.3.7',
        Domain: 'monitor2.comms24x7.com' 
    } ],
    loginUrl: 'https://loginapi.comms24x7.com/monitorAPI/Login',
    refreshTokenUrl: 'https://loginapi.comms24x7.com/monitorAPI/RefreshIdentityToken',
    fallbackServer: {
        Domain: 'monitor5.voicenter.co.il',
        Priority: 0,
        Version: '1.3.7',
        URLID: 1
    },
    token: 'lJVBSEk084tzLaFpIWTReBw54trHD2Jlt8hThhX6OAxJ5IjyCC740znrXXgIzj1QtM67n2NOEGNn4SjrPJxuvkxbFb4tWHjS3cyh',
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
    username: 'username',
    password: '92455783085',
    email: 'sasha.za@starkey.co.il',
}
