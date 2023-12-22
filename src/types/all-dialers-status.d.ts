import { BaseEvent } from '@/types/events'
import { DialerType } from 'enum/events.enum'

export interface AllDialersStatus extends BaseEvent {
    dialers: Dialer[]
}

interface Dialer {
    campaignID: number,
    name: string,
    typeID: number,
    type: DialerType,
    code: string,
    calls: unknown,
    statistics: unknown
}