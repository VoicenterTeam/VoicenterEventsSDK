import { Socket } from 'socket.io-client'
import { LoginType } from '@/enum/auth.enum'
import StorageLogger, { LoggerOptions } from '@voicenter-team/socketio-storage-logger'

export interface EventsSdkOptions {
    isNewStack?: boolean,
    servers?: Server[],
    loginUrl: string,
    getSettingsUrl?: string
    refreshTokenUrl: string,
    refreshToken?: string,
    token: string,
    tokenExpiry?: Date,
    loginType: LoginType,
    forceNew?: boolean,
    reconnectionDelay: number,
    reconnectionDelayMax?: number,
    maxReconnectAttempts: number,
    timeout?: number,
    keepAliveTimeout: number,
    idleInterval?: number,
    protocol: string,
    transports?: string[],
    upgrade?: boolean,
    serverFetchStrategy?: string,
    serverType?: number,
    useLogger?: boolean,
    loggerSocketConnection?: Socket,
    loggerServer: string,
    loggerConfig: LoggerOptions,
    loggerConnectOptions?: LoggerConnectOptions,
    email: string,
    password: string,
    username: string,
    storageLoggerInstance: StorageLogger | undefined
}

export interface Server {
    Priority: number,
    Domain: string,
    URLID: number,
    Version: string,
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
    perMessageDeflate?: {
        threshold: number
    },
    upgrade?: boolean,
    transports?: string[],
    debug?: boolean
}

export enum ServerParameter {
    MAIN = 'main',
    NEXT = 'next'
}
