import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Server } from '@/classes/events-sdk/events-sdk.types'

export class SocketIoClass {
    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    public server: Server | undefined
    public servers: Server[] | undefined

    public getSocketIoFunction (Client: string) {
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    public setServer (server: Server) {
        this.server = server
    }

    public setServersByURLList (URLList: string[]) {
        this.servers = URLList.map((url, index) => {
            return {
                Priority: index,
                Domain: url.replace('https://', '')
            }
        })
    }
}
