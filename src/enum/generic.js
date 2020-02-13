// Time zone in Israel (GMT+2)
export const ISRAEL_TIMEZONE_OFFSET = 120 * 60 * 1000;

export const TIME_LINE_TIMESTAMP = {
    DAY: 1000 * 24 * 3600,
    WEEK: 1000 * 24 * 3600 * 7,
    MONTH: 1000 * 24 * 3600 * 30,
}

export const DAY = TIME_LINE_TIMESTAMP.DAY
export const HOUR = TIME_LINE_TIMESTAMP.DAY / 24
export const MINUTE = HOUR / 60
