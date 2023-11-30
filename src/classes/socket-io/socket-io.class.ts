import sockets, { TypedSocketIo } from '@/classes/socket-io/versions'
import { SocketTyped } from '@/types/socket'
import { Server } from '@/classes/events-sdk/events-sdk.types'
import { SocketIoOptions } from '@/classes/socket-io/socket-io'

export class SocketIoClass {
    public io: SocketTyped | undefined
    public ioFunction: TypedSocketIo | undefined
    public server: Server | undefined
    public servers: Server[] | undefined

    public initSocketConnection (token: string) {
        try {
            // const domain = this.server.Domain;
            //
            // const protocol = this.options.protocol;
            //
            // const url = `${protocol}://${domain}`;

            // this.log(INFO, 'Connecting to..', url);

            // this.closeAllConnections();

            const options: SocketIoOptions = {
                reconnection: false,
                perMessageDeflate: false,
                upgrade: false,
                transports: [ 'websocket' ],
                debug: false,
                query: {
                    token: ''
                }
            }

            if (token) {
                options.query = {
                    token
                }
            }

            // allConnections.push(this.socket);
        } catch (e) {
            // this.log(ERROR, e);
        }
    }

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
