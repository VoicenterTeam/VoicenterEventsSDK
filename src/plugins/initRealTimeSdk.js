import { sdkEventTypes } from "@/enum/sdkEvents";
import store from "@/store/store";
import EventsSDK from "voicenter-events-sdk";
import parseCatch from "@/helpers/handleErrors";
import EventBus from "@/event-bus/EventBus";

let sdk = null
function onNewEvent(eventData) {
    switch (eventData.name) {
        case sdkEventTypes.CONNECT_ERROR:
            EventBus.$emit(sdkEventTypes.CONNECT_ERROR)
            break;
        case sdkEventTypes.CONNECT_TIMEOUT:
            EventBus.$emit(sdkEventTypes.CONNECT_TIMEOUT)
            break;
        default:
            break;
    }
}

export default async function initRealTimeSdk() {
    try {
        if (sdk) {
            sdk.emit(sdkEventTypes.CLOSE)
            sdk = null
        }
        const config = {
            token: store.state.users.tokenString,
            store: store,
            extensionsModuleName: 'extensions',
            queuesModuleName: 'queues',
            serverFetchStrategy: process.env.VUE_APP_EVENTS_SERVER_FETCH_STRATEGY,
        }
        if (process.env.VUE_APP_EVENTS_SDK_URL) {
            config.url = process.env.VUE_APP_EVENTS_SDK_URL
        }
        if (process.env.VUE_APP_EVENTS_SDK_SERVERS) {
            config.servers = process.env.VUE_APP_EVENTS_SDK_SERVERS
        }
        if (typeof config.servers === 'string') {
            config.servers = JSON.parse(config.servers)
        }
        console.log(store)
        sdk = new EventsSDK(config)
        await sdk.init()
        sdk.on('*', onNewEvent)
    } catch (e) {
        parseCatch(e, true)
    }
}

export function reSyncSdk() {
    if (!sdk) {
        return
    }
    sdk.reSync(false)
}

export async function setToken(token) {
    if (!sdk) {
        return
    }
    await sdk.setToken(token)
}
