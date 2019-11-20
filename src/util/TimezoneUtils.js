import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'

export  function getTimezoneTimestamp(timestampInSeconds){
    return timestampInSeconds * 1000 - ISRAEL_TIMEZONE_OFFSET
}
