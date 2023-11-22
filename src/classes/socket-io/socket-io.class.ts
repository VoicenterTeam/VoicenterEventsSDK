import { SocketIoOptions } from './socket-io.types';
import { Environment } from '../events-sdk/events-sdk.types';
import s137 from './socket-io.1.3.7.js';

export class SocketIoClass {
    constructor (private readonly url: string, private readonly options: SocketIoOptions) {
        this.url = url;

        this.options = options;
    }

    public socketIoFunction;

    public async loadExternalScript (url: string, environment: Environment, useHelperVersion = true) {
        if (useHelperVersion) {
            this.socketIoFunction = this.getSocketIoFunction();

            return;
        }

        switch (environment) {
            case Environment.BROWSER:
                // await loadBrowserScript(url);
                break;
            case Environment.CHROME_EXTENSION:
                // await loadExtensionScript(url);
        }
    }

    private getSocketIoFunction () {
        return s137;
    }
}
