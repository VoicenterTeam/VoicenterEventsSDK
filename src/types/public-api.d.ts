import type { ListenerCallbackFnType, ListenersKeyType } from './listeners'

export namespace Widget {
    /**
     * Represents the event map for the widget.
     */
    export type EventMap = {
        'widget:ready': IWidgetExternalAPIConstructor,
        'widget:destroy': undefined,
    }

    /**
     * Represents the dispatch action event for the widget.
     */
    export type DispatchActionEvent = <Event extends keyof EventMap>(
        event: Event,
        data: EventMap[Event]
    ) => void
}

/**
 * Represents SIP credentials.
 */
export interface ISIPSCredentials {
    username: string
    password: string
    domain: string
}

/**
 * The colors of the widget:
 */
export type ColorsType =
    'primary'
    | 'secondary'
    | 'main-text'
    | 'secondary-text'
    | 'button-pressed-text'
    | 'border-lines'
    | 'primary-bg'
    | 'secondary-bg'
    | 'inactive-bg'
    | 'success'
    | 'danger'
    | 'additional-danger-bg'
    | 'additional-success-bg'
    | 'additional-bg'

export interface ImagesConfig {
    backgroundLogo?: string
}

/**
 * Represents the configuration options for the widget theme.
 */
export interface IWidgetTheme {
    colors: Record<ColorsType, string>
    images: ImagesConfig
    layoutConfig: ILayoutConfig
}

export interface IWidgetConfig {
    themeSettings: IWidgetTheme
    callSettings: ICallSettings
}

/**
 * Represents the configuration options for the widget.
 */
export type TWidgetConfigOptions = Partial<IWidgetConfig>

/**
 * Represents the external API provided by the widget.
 */
export interface IWidgetExternalAPI {
    /**
     * Allows subscribing to sips events.
     *
     * @param type - type of event, check ListenersKeyType
     * @param listener - the event listener, check ListenerCallbackFnType of provided event
     */
    on: <T extends ListenersKeyType> (type: T, listener: ListenerCallbackFnType<T>) => IWidgetExternalAPI

    /**
     * Changes the widget configuration.
     *
     * @param config
     */
    setConfig: (config: TWidgetConfigOptions) => IWidgetExternalAPI

    /**
     * Returns current widget configuration.
     */
    getConfig: () => TWidgetConfigOptions

    /**
     * Logs in to the SIP server.
     *
     * @param credentials
     */
    login: (credentials: ISIPSCredentials) => Promise<IWidgetExternalAPI>
}

export interface IWidgetExternalAPIConstructor {
    new (config: TWidgetConfigOptions): IWidgetExternalAPI
}

/**
 * Represents the layout modes for the widget.
 */
export type TLayoutMode = 'floating' | 'docked' | 'fixed'

/**
 * Represents the layout types for the widget.
 */
export type TLayoutType = 'small' | 'rounded' | 'squared'

/**
 * Represents the anchor position for the widget.
 */
export type TAnchor = 'bottom-center' | 'top-center' | 'center' | null

/**
 * Represents the position configuration for the widget. If the position parameter is not specified, the value will be set to 'auto'.
 * Accepts any valid css value for left, top, right, bottom.
 * If the anchor parameter is specified, the opposite to anchor value position parameters will be ignored.
 * For example, if anchor value is 'bottom-center', only bottom parameter will be used.
 */
export type TPositionConfig = {
    left?: string | number
    top?: string | number
    right?: string | number
    bottom?: string | number
    anchor?: TAnchor
}

export type TPosition = keyof Omit<TPositionConfig, 'anchor'>

/**
 * Represents the base layout configuration for the widget.
 */
export interface IBaseLayoutConfig {
    mode: TLayoutMode
    type: TLayoutType
    position: TPositionConfig
}

/**
 * Represents the floating layout configuration for the widget.
 * In this mode, the position right and bottom are ignored.
 */
export interface IFloatingLayoutConfig extends IBaseLayoutConfig {
    mode: 'floating'
}

/**
 * Represents the docked layout configuration for the widget.
 */
export interface IDockedLayoutConfig extends IBaseLayoutConfig {
    mode: 'docked'
}

/**
 * Represents the fixed layout configuration for the widget.
 */
export interface IFixedLayoutConfig extends IBaseLayoutConfig {
    mode: 'fixed'
}

/**
 * Represents the layout configuration for the widget.
 */
export type ILayoutConfig = IFloatingLayoutConfig | IDockedLayoutConfig | IFixedLayoutConfig

/**
 * Represents the call settings for the widget.
 */
export interface ICallSettings {
    allowTransfer: boolean
    autoAnswer: IAutoAnswerSettings
    outgoingCalls: boolean
    callerInfo: ICallerInfoSettings
    shrinkOnIdle: boolean
    ringingSound: string
    outgoingCallPrefixPlaceHolder: string
}

/**
 * Represents the auto answer settings for the widget.
 */
export interface IAutoAnswerSettings {
    allowChange: boolean
    defaultBehavior: boolean
}

/**
 * Represents the caller information settings for the widget.
 */
export interface ICallerInfoSettings {
    displayName: boolean
    callerId: {
        display: boolean
        mask: boolean
    }
}

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
