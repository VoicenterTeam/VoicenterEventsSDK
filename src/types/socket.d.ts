import { Socket } from 'socket.io-client'
import { EventFunctionsMap } from '@/types/events'
import { EventsEnum } from 'enum/events.enum'

export type SocketTyped = Socket<EventFunctionsMap, Record<EventsEnum, any>>
