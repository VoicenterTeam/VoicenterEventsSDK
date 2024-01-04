import { Socket } from 'socket.io-client'
import { SocketsEvents } from '@/types/events'
import { EventsEnum } from 'enum/events.enum'

export type SocketTyped = Socket<SocketsEvents, Record<EventsEnum, any>>
