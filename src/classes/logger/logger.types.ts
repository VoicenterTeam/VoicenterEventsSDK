import { EventsEnum, AllExtensionStatusEvent, AllDialersStatusEvent } from '@voicenter-team/real-time-events-types'

export type BootstrapLogData = {
    [EventsEnum.ALL_EXTENSION_STATUS]: AllExtensionStatusEvent,
    [EventsEnum.ALL_DIALER_STATUS]: AllDialersStatusEvent,
}
