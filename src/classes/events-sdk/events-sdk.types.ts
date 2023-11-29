export interface EventsSdkOptions {
    url?: string,
    environment?: string,
    fallbackServer: Server,
    loginUrl?: string,
    refreshTokenUrl?: string,
    servers?: string,
    token: string,
    loginType?: string,
    forceNew?: boolean,
    reconnectionDelay?: number,
    reconnectionDelayMax?: number,
    maxReconnectAttempts?: number,
    timeout?: number,
    keepAliveTimeout?: number,
    idleInterval?: number,
    protocol?: string,
    transports?: string[],
    upgrade?: boolean,
    store?: string,
    extensionsModuleName?: string,
    queuesModuleName?: string,
    dialersModuleName?: string,
    serverFetchStrategy?: string,
    serverType?: number,
    useLogger?: boolean,
    loggerSocketConnection?: string,
    loggerServer?: string,
    loggerConfig?: LoggerConfig,
    loggerConnectOptions?: LoggerConnectOptions,
    email: string,
    password: string,
    username: string
}

export enum Environment {
    BROWSER = 'browser',
    CHROME_EXTENSION = 'chrome-extension'
}

export interface Server {
    Priority: number,
    Domain: string
}

export interface LoggerConfig {
    logToConsole?: boolean,
    overloadGlobalConsole?: boolean,
    namespace?: string,
    socketEmitInterval?: number
}

export interface LoggerConnectOptions {
    reconnection?: boolean,
    reconnectionDelay?: number,
    reconnectionAttempts?: number,
    perMessageDeflate?: boolean,
    upgrade?: boolean,
    transports?: string[],
    debug?: boolean
}

export interface ReconnectOptions {
    retryCount: number,
    maxReconnectAttempts: number,
    reconnectionDelay: number,
    minReconnectionDelay: number,
    maxReconnectionDelay: number
}

export enum ServerParameter {
    DEFAULT = 'default',
    NEXT = 'next',
    PREVIOUS = 'previous'
}