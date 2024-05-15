import { Socket } from 'socket.io-client'
import { LoginType } from '@/enum/auth.enum'
import StorageLogger, { LoggerOptions } from '@voicenter-team/socketio-storage-logger'

interface EvetsSdkOptionsBase {
    isNewStack?: boolean,
    loginType: LoginType,
}

interface EventsSdkOptionsLoginUser extends EvetsSdkOptionsBase {
    loginType: LoginType.USER,
    email: string,
    password: string,
}

interface EventsSdkOptionsLoginToken extends EvetsSdkOptionsBase {
    loginType: LoginType.TOKEN
    token: string
}

type Options = EventsSdkOptionsLoginUser | EventsSdkOptionsLoginToken

function a (options: Options) {
    console.log(a)
}
a({
    email: 'asd',
    loginType: LoginType.TOKEN,
    token: '123' 
})

export interface EventsSdkOptions {
    servers?: Server[],
    loginUrl: string,
    getSettingsUrl?: string
    refreshTokenUrl?: string,
    refreshToken?: string,
    tokenExpiry?: Date,
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
    serverFetchStrategy?: string,
    serverType?: number,
    useLogger?: boolean,
    loggerSocketConnection?: Socket,
    loggerServer?: string,
    loggerConfig?: LoggerOptions,
    loggerConnectOptions?: LoggerConnectOptions,
    storageLoggerInstance?: StorageLogger | undefined
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
