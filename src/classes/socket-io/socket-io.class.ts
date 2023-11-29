// import s137 from '@/classes/socket-io/socket-io.1.3.7.js'
import { Environment } from '@/classes/events-sdk/events-sdk.types'
import sockets from '@/classes/socket-io/versions'
import { Socket } from 'socket.io-client'

export class SocketIoClass {
    constructor (private readonly url: string) {
        this.io = this.getSocketIoFunction()
    }

    public io: Socket

    public loadExternalScript (environment: Environment, useHelperVersion = false) {
        if (useHelperVersion) {
            this.io = this.getSocketIoFunction()

            return
        }

        switch (environment) {
            case Environment.BROWSER:
                this.loadBrowserScript(this.url)
                break
            case Environment.CHROME_EXTENSION:
                this.loadExtensionScript(this.url)
        }
    }

    private loadBrowserScript (url: string) {
        console.log(url)
    }

    private loadExtensionScript (url: string) {
        console.log(url)
    }

    private getSocketIoFunction () {
        return sockets.makeSocketVersion(
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
