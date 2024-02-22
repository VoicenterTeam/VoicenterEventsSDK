import {
    EventCallbackListenersMap,
    EventSpecificCallback,
    EventTypeData,
    EventTypeNames,
    GenericEventWrapper
} from '@/types/events'
import { EventsEnum } from '@/enum/events.enum'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'

export class EventEmitterClass{
    private listeners: EventCallbackListenersMap = {
        [EventsEnum.ALL_EXTENSION_STATUS]: [],
        [EventsEnum.ALL_DIALER_STATUS]: [],
        [EventsEnum.ALL_USERS_STATUS]: [],
        [EventsEnum.QUEUE_EVENT]: [],
        [EventsEnum.EXTENSION_EVENT]: [],
        [EventsEnum.DIALER_EVENT]: [],
        [EventsEnum.LOGIN_SUCCESS]: [],
        [EventsEnum.LOGIN_STATUS]: [],
        [EventsEnum.KEEP_ALIVE_RESPONSE]: [],
        [EventsEnum.ONLINE_STATUS_EVENT]: []
    }
    private allListeners: Array<(data: GenericEventWrapper) => void> = []

    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public on<T extends EventTypeNames> (event: T, callback: EventSpecificCallback<T>): void
    public on (event: '*', callback: (data: GenericEventWrapper) => void): void
    public on (event: unknown, callback: unknown) {
        if (event === '*') {
            this.allListeners.push(callback as (data: GenericEventWrapper) => void)
        } else {
            // Handle specific event type with strong typing
            this.listeners[event as EventTypeNames].push(callback as EventSpecificCallback<EventTypeNames>)
        }
    }

    public off<T extends EventTypeNames> (event: T, callback: EventSpecificCallback<T>): void
    public off (event: '*', callback: (data: GenericEventWrapper) => void): void
    public off (event: unknown, callback: unknown) {
        if (event === '*') {
            this.allListeners = this.allListeners.filter(item => item !== callback)
        } else {
            const data = this.listeners[event as EventTypeNames] as Array<EventSpecificCallback<EventTypeNames>>
            const filtered = data.filter(item => item !== callback)

            this.listeners = {
                ...this.listeners,
                [event as EventTypeNames]: filtered
            }
        }
    }

    public emit <T extends EventTypeNames> (event: T, data: EventTypeData<T>) {
        this.eventsSdkClass.socketIoClass.lastEventTimestamp = new Date().getTime()

        this.listeners[event].forEach(callback => callback({
            name: event,
            data
        }))

        const allEventData: GenericEventWrapper = {
            name: event,
            data: data as any
        }

        this.allListeners.forEach((callback) => callback(allEventData))
    }
}