import { WsOptions } from './ws.types';

export class WsClass {
    constructor (private readonly url: string, private readonly options: WsOptions) {
        this.url = url;

        this.options = options;
    }
}