import {getServerTimeOffset} from '@/enum/generic'
import store from '@/store/store'

export function getTimezoneTimestamp (timestampInSeconds) {
    return timestampInSeconds * 1000 - getServerTimeOffset() + getServerDelta()
}

export function getInitialTime (seconds) {
    let initialTime = new Date().getTime() - getTimezoneTimestamp(seconds)
    return initialTime > 0 ? Math.floor(initialTime / 1000) : 0
}

function getServerDelta () {
    return store.state.extensions.serverDelta
}

export function getInitialExtensionTime (extension, settings = {}) {
    const valuesToCompare = [extension.lastAnsweredCallEventEpoch, extension.representativeUpdated / 1000]
    if (settings.resetIdleTime) {
        valuesToCompare.push(extension.lastCallEventEpoch)
    }
    const lastEventTimestamp = Math.max(...valuesToCompare)
    return getInitialTime(lastEventTimestamp)
}
