import { Socket } from 'socket.io-client'
import { EventFunctionsMap } from '@/types/events'

export type SocketTyped = Socket<EventFunctionsMap, Record<string, unknown>>
