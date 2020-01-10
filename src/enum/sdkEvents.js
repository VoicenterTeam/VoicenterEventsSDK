export const sdkEventTypes = {
    LOGIN: 'loginStatus',
    LOGIN_RESPONSE: 'loginResponse',
    QUEUE_EVENT: 'QueueEvent',
    EXTENSION_EVENT: 'ExtensionEvent',
    ALL_EXTENSION_STATUS: 'AllExtensionsStatus',
    CONNECT_ERROR: 'connect_error',
    CONNECT_TIMEOUT: 'connect_timeout',
    DISCONNECT: 'disconnect',
    RECONNECT: 'reconnect',
    RECONNECT_ATTEMPT: 'reconnect_attempt',
    RECONNECTING: 'reconnecting',
    RECONNECT_ERROR: 'reconnect_error',
    RECONNECT_FAILED: 'reconnect_failed',
    KEEP_ALIVE: 'keepalive',
    KEEP_ALIVE_RESPONSE: 'keepaliveResponse',
    CLOSE: 'closeme',
    ERROR: 'error'
}

export const sdkEventReasons = {
    NEWCALL: 'NEWCALL',
    ANSWER: 'ANSWER',
    HANGUP: 'HANGUP'
}
