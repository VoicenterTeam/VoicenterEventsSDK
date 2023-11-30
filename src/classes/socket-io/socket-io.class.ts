import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Server } from '@/classes/events-sdk/events-sdk.types'

export class SocketIoClass {
    public static io: SocketTyped | undefined
    public static ioFunction: TypedSocketIo | undefined
    public static server: Server
    public static servers: Server[]

    public static getSocketIoFunction (Client: string) {
        const parsedArray = Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }

    public static setServer (server: Server) {
        this.server = server
    }

    public static setServersByURLList (URLList: string[]) {
        this.servers = URLList.map((url, index) => {
            return {
                Priority: index,
                Domain: url.replace('https://', '')
            }
        })
    }
}
