import { EventsSdkOptions, Server } from './events-sdk.types';
import { eventsSdkDefaultOptions } from './events-sdk-default-options';

class EventsSdkClass {
    constructor (private readonly options: EventsSdkOptions = {}) {
        this.options = {
            ...eventsSdkDefaultOptions,
            ...options
        };

        this.argumentOptions = this.options;
    }

    private argumentOptions: EventsSdkOptions;
    private server: Server;
}

export default EventsSdkClass;