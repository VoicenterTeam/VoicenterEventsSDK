import { Socket } from 'socket.io-client'
import { EventCallbackRegistry } from '@/types/events'
import { EventsEnum } from 'enum/events.enum'

export type SocketTyped = Socket<EventCallbackRegistry, Record<EventsEnum, any>>
