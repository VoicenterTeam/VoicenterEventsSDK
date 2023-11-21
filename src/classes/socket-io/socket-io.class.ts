import { SocketIoOptions } from './socket-io.types';
import { Environment } from '../events-sdk/events-sdk.types';

export class SocketIoClass {
    constructor (private readonly url: string, private readonly options: SocketIoOptions) {
        this.url = url;

        this.options = options;
    }

    private socketIo = null;

    private async loadExternalScript (url: string, environment: Environment, useHelperVersion = false) {
        if (useHelperVersion) {
            // this.socketIo = this.getWsFunction(url);

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
}
