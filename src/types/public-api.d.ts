/**
 * Represents Event Types in Enum
 */
export enum EventTypesEnum {
    ALL_DIALERS_STATUS = 'AllDialersStatus',
    ALL_EXTENSION_STATUS = 'AllExtensionsStatus',
    CLOSE = 'closeme',
    CONNECT = 'connect',
    CONNECT_ERROR = 'connect_error',
    CONNECT_TIMEOUT = 'connect_timeout',
    DISCONNECT = 'disconnect',
    DIALER_EVENT = 'DialerEvent',
    DIALERS_UPDATED = 'DialersUpdated',
    ERROR = 'error',
    EXTENSION_EVENT = 'ExtensionEvent',
    EXTENSION_UPDATED = 'ExtensionsUpdated',
    KEEP_ALIVE = 'keepalive',
    KEEP_ALIVE_RESPONSE = 'keepaliveResponse',
    LOGIN = 'login',
    LOGIN_ACCOUNT = 'loginAccount',
    LOGIN_CODE = 'loginUserCode',
    LOGIN_RESPONSE = 'loginResponse',
    LOGIN_STATUS = 'loginStatus',
    LOGIN_USER = 'loginUser',
    PONG = 'pong',
    QUEUE_EVENT = 'QueueEvent',
    QUEUES_UPDATED = 'QueuesUpdated',
    RECONNECT = 'reconnect',
    RECONNECT_ATTEMPT = 'reconnect_attempt',
    RECONNECT_ERROR = 'reconnect_error',
    RECONNECT_FAILED = 'reconnect_failed',
    RECONNECTING = 'reconnecting',
    RESYNC = 'resync'
}

export enum ServerTypesEnum {
    DEFAULT = 1,
    CHROME_EXTENSION = 2
}
