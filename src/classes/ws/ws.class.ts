import { WsOptions } from './ws.types';
import { Environment } from '../events-sdk/events-sdk.types';

export class WsClass {
    constructor (private readonly url: string, private readonly options: WsOptions) {
        this.url = url;

        this.options = options;
    }

    private socket = null;

    private async loadExternalScript (url: string, environment: Environment, useHelperVersion = false) {
        if (useHelperVersion) {
            // this.socket = this.getWsFunction(url);

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
