import s137 from '@/classes/socket-io/socket-io.1.3.7.js'
import { SocketIoOptions } from '@/classes/socket-io/socket-io'
import { Environment } from '@/classes/events-sdk/events-sdk'

export class SocketIoClass {
    constructor (private readonly url: string, private readonly options: SocketIoOptions) {
        this.url = url

        this.options = options
    }

    public socketIoFunction

    public async loadExternalScript (url: string, environment: Environment, useHelperVersion = true) {
        if (useHelperVersion) {
            this.socketIoFunction = this.getSocketIoFunction()

            return
        }

        switch (environment) {
            case Environment.BROWSER:
                // await loadBrowserScript(url);
                break
            case Environment.CHROME_EXTENSION:
                // await loadExtensionScript(url);
        }
    }

    private getSocketIoFunction () {
        return s137
    }
}
