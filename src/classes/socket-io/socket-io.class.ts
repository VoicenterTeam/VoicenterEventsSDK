import sockets from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'

export class SocketIoClass {
    public static io: SocketTyped | undefined

    public static getSocketIo () {
        this.io = sockets.makeSocketVersion(
            'v1_3_7',
            'https://monitor4.voicenter.co/',
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
