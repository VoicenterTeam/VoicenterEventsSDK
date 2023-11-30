import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { LoginSessionData } from '@/types/auth'

export class SocketIoClass {
    public static io: SocketTyped | undefined
    public static ioFunction: TypedSocketIo | undefined

    public static getSocketIoFunction (loginSessionData: LoginSessionData) {
        const parsedArray = loginSessionData.Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.ioFunction = sockets.getSocketVersion(version)
    }
}
