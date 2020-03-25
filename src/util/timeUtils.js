import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'
import store from '@/store/store'
export  function getTimezoneTimestamp(timestampInSeconds){
    return timestampInSeconds * 1000 - ISRAEL_TIMEZONE_OFFSET + getServerDelta()
}

export function getInitialTime(seconds) {
    console.log('SERVER DELTA', getServerDelta())
    let initialTime = new Date().getTime() - getTimezoneTimestamp(seconds)
    return Math.floor(initialTime / 1000)
}

function getServerDelta() {
    return store.state.extensions.serverDelta
}

function getTimerValue(seconds) {
    let initialTime = new Date().getTime()  - getTimezoneTimestamp(seconds)
    return Math.floor(initialTime / 1000)
}

export function getInitialExtensionTime(extension, settings = {}) {
    const valuesToCompare = [extension.lastAnsweredCallEventEpoch, extension.representativeUpdated/1000]
    if (settings.resetIdleTime) {
        valuesToCompare.push(extension.lastCallEventEpoch)
    }
    const lastEventTimestamp = Math.max(...valuesToCompare)
    return getTimerValue(lastEventTimestamp)
}
