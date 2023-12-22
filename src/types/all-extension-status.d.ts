import { BaseEvent } from '@/types/events'
import { Extension } from '@/types/extension-event'

export interface AllExtensionStatus extends BaseEvent {
    extensions: Extension[]
}

