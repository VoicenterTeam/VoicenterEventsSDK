import { Socket } from 'socket.io-client'
import { EventCallbackRegistry } from '@/types/events'
import { EventsEnum } from '@voicenter-team/real-time-events-types'

export type SocketTyped = Socket<EventCallbackRegistry, Record<EventsEnum, any>>
