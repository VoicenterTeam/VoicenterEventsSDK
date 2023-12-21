/**
 * All events that can be received from the server.
 */
export enum EventsEnum {
    ALL_DIALER_STATUS = 'AllDialersStatus',
    ALL_EXTENSION_STATUS = 'AllExtensionsStatus',
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    EXTENSION_EVENT = 'ExtensionEvent',
    KEEP_ALIVE = 'keepalive',
    KEEP_ALIVE_RESPONSE = 'keepaliveResponse',
    // This type of event will be sent only in case of a successful connection.
    // The event describes the list of monitored queues on this active connection.
    // The list of monitored queues will only be sent if the login connection was made with account credentials or account token.
    // If the login connection type is by user credentials, only the user’s extension assigned queues will return.
    LOGIN_STATUS = 'loginStatus',
    // This type of event will be sent in the initial login connection request in case of a successful connection only.
    // In case of wrong username or password or token, you will receive a 401 (“Unauthorized”) or 500 (“Unexpected token”) http error.
    LOGIN_SUCCESS = 'loginSuccess',
    QUEUE_EVENT = 'QueueEvent',
}

/**
 * All the reasons for the extension event, e.g. a new call is ringing or dialing from an extension.
 */
export enum ExtensionEventReasonEnum {
    // A new call is ringing or dialing from an extension.
    NEW_CALL = 'NEWCALL',
    // A call was answered at an extension.
    ANSWER = 'ANSWER',
    // A call was placed on hold.
    HOLD = 'HOLD',
    // A call is no longer on hold.
    UNHOLD = 'UNHOLD',
    // When a call was ended. It is not necessarily means that the call was answered.
    HANGUP = 'HANGUP',
    // When the extension online user updated his\her user status(Login, Break, Logout, etc.)
    USER_STATUS_UPDATE = 'userStatusUpdate',
}

/**
 * All the eventNames that can be received from the server. Exists only in EXTENSION_EVENT and QueueEvent
 */
export enum EventNameEnum {
    EXTENSION = 'extension',
    QUEUE = 'queue',
}

export enum ExtensionHangupCauseEnum {
    NORMAL_HANGUP = 'Normal hangup',
    USER_BUSY = 'User busy',
    CALL_REJECTED = 'Call Rejected',
    UNALLOCATED_NUMBER = 'Unallocated (unassigned) number',
    UNKNOWN = 'Unknown',
    NO_USER_RESPONDING = 'No user responding',
}

export enum CallStatusEnum {
    RINGING = 'Ringing',
    TALKING = 'Talking',
    DIALING = 'Dialing',
    HOLD = 'Hold',
}

export enum DoNotCallMeStatusCodeEnum {
    RESPONSE_FROM_API_VALID = 'RESPONSE_FROM_API_VALID',
    RESPONSE_FROM_API_INVALID = 'RESPONSE_FROM_API_INVALID'
}

export enum DirectionEnum {
    INCOMING = 'Incoming',
    OUTGOING = 'Outgoing',
}
