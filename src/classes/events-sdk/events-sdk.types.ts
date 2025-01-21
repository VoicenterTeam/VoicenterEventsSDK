import { Socket } from 'socket.io-client'
import StorageLogger, { LoggerOptions } from '@voicenter-team/socketio-storage-logger'

import { LoginType } from '@/enum/auth.enum'
import { DebugOption } from '@/enum/events-sdk.enum'

export interface EventsSdkOptionsBase {
    loginType: LoginType,
    isNewStack?: boolean,
    forceNew?: boolean,
    servers?: Server[],
    reconnectionDelay?: number,
    timeout?: number,
    keepAliveTimeout?: number,
    protocol?: string,
    useLogger?: boolean,
    loggerSocketConnection?: Socket,
    loggerServer?: string,
    loggerConfig?: LoggerOptions,
    loggerConnectOptions?: LoggerConnectOptions,
    storageLoggerInstance?: StorageLogger,
    debugOption?: DebugOption,
    // transports?: string[],
    // upgrade?: boolean,
    // serverFetchStrategy?: string,
    // serverType?: number,
    // idleInterval?: number,
    // reconnectionDelayMax?: number,
    // maxReconnectAttempts: number,
}

type EventsSdkOptionsUserLogin = EventsSdkOptionsBase & {
    loginType: LoginType.USER,
    email: string,
    password: string,
}

type EventsSdkOptionsTokenLogin = EventsSdkOptionsBase & {
    loginType: LoginType.TOKEN,
    token: string,
}

type EventsSdkOptionsOldStack = EventsSdkOptionsBase & {
    isNewStack?: false,
    loginUrl?: string,
    refreshTokenUrl?: string,
}

type EventsSdkOptionsNewStack = EventsSdkOptionsBase & {
    isNewStack: true,
    loginUrl?: string,
    refreshTokenUrl?: string,
    getSettingsUrl: string,
}

export type EventsSdkOptionsClient = EventsSdkOptionsUserLogin | EventsSdkOptionsTokenLogin | EventsSdkOptionsOldStack | EventsSdkOptionsNewStack

export type EventsSdkOptionsMain = Required<Pick<
    EventsSdkOptionsOldStack | EventsSdkOptionsNewStack,
    'isNewStack' |
    'loginUrl' |
    'refreshTokenUrl' |
    'forceNew' |
    'protocol' |
    'timeout' |
    'loggerConfig' |
    'keepAliveTimeout' |
    'reconnectionDelay' |
    'loggerServer' |
    'useLogger'
    >> & {
    getSettingsUrl?: string,
    token?: string,
    email?: string,
    password?: string,
    debugOption?: DebugOption,
    storageLoggerInstance?: StorageLogger,
    loggerConnectOptions?: LoggerConnectOptions,
    loggerSocketConnection?: Socket
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
    system: string,
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
