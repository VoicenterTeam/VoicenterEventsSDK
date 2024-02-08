import { EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'
import { LoginType } from '@/enum/auth.enum'

export const eventsSdkDefaultOptions: EventsSdkOptions = {
    fallbackServer: {
        Domain: 'monitor5.voicenter.co.il',
        Priority: 0,
        Version: '1.3.7',
        URLID: 1
    },
    token: '',
    loginType: LoginType.TOKEN,
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
        perMessageDeflate: false,
        upgrade: false,
        transports: [ 'websocket' ],
        debug: false
    },
    username: 'username',
    password: '78253050510',
    email: 'test2@status.com',
}
