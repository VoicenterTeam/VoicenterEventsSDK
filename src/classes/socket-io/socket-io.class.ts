import sockets from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { LoginSessionData } from '@/types/auth'

export class SocketIoClass {
    public static io: SocketTyped | undefined

    public static getSocketIo (loginSessionData: LoginSessionData) {
        const parsedArray = loginSessionData.Client.split('v=')

        const version = 'v'
            .concat(parsedArray[parsedArray.length - 1])
            .replaceAll('.', '_')

        this.io = sockets.makeSocketVersion(
            version,
            loginSessionData.URL,
            {
                transports: [ 'websocket' ],
                query: {
                    token: 'QMSVU9dwNYC9Le9VCBqx24AB9TYyWj9Xn5aCPV0GFHIWoShQqfPtnAPmnw24xpJIUSsDDtlac2OPpjx0t3MSkxH3AhiQGHCeGZ8e'
                },
                reconnection: false,
                upgrade: false,
            }
        )
    }
}
