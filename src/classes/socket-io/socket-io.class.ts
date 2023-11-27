// import s137 from '@/classes/socket-io/socket-io.1.3.7.js'
import { Environment } from '@/classes/events-sdk/events-sdk'

export class SocketIoClass {
    constructor (private readonly url: string) {}

    public socketIoFunction = null

    public async loadExternalScript (environment: Environment, useHelperVersion = true) {
        if (useHelperVersion) {
            this.socketIoFunction = this.getSocketIoFunction()

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
        return null
    }
}
