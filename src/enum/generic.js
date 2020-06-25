import store from '@/store/store'
// Time zone in Israel (GMT+2)
export const ISRAEL_TIMEZONE_OFFSET = 120 * 60 * 1000;

export function getServerTimeOffset() {
    return store.state.extensions.serverOffset
}
export const TIME_LINE_TIMESTAMP = {
    DAY: 1000 * 24 * 3600,
    WEEK: 1000 * 24 * 3600 * 7,
    MONTH: 1000 * 24 * 3600 * 30,
}

export const DAY = TIME_LINE_TIMESTAMP.DAY
export const HOUR = TIME_LINE_TIMESTAMP.DAY / 24
export const MINUTE = HOUR / 60

export const DEFAULT_TIME_DELAY = 30

export const getDefaultTimeDelay = () => {
    let minutes = store.getters['dashboards/refreshDelay'] || DEFAULT_TIME_DELAY;
    let miliSeconds = minutes * 60 * 100;
    return miliSeconds
}

//Queue Activity Gauge suggestive word/key
export const queueActivityGaugeKey = 'GetQueuesGaugeById'

export const DEFAULT_LAYOUT_ID = 1
