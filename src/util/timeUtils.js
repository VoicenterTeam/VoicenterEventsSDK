import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'

export  function getTimezoneTimestamp(timestampInSeconds){
    return timestampInSeconds * 1000 - ISRAEL_TIMEZONE_OFFSET
}

export function getInitialTime(seconds) {
    let initialTime = new Date().getTime() - getTimezoneTimestamp(seconds)
    return Math.floor(initialTime / 1000)
}
