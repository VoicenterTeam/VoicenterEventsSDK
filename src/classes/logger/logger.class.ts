import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { Socket } from 'socket.io-client'

export class LoggerClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }

    public io: Socket | undefined

    public init (url: string, options: any) {
        if (this.eventsSdkClass.socketIoClass.ioFunction) {
            console.log(url, options)
        }
    }
}