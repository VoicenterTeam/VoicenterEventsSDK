export interface EventsSdkOptions {
    url?: string,
    environment?: string,
    fallbackServer?: Server,
    loginUrl?: string,
    refreshTokenUrl?: string,
    servers?: string,
    token?: string,
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
    loggerConnectOptions?: LoggerConnectOptions
}

export interface Server {
    Priority?: number,
    Domain?: string,
}

export interface LoggerConfig {
    logToConsole?: boolean,
    overloadGlobalConsole?: boolean,
    namespace?: string,
    socketEmitInterval?: number,
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