import config from '@/config'

export default {
    1: {
        icon: "IconOutgoing",
        color: config.colors.info,
        text: 'queue.counter.callers'
    },
    2: {
        icon: "IconPhone",
        color: config.colors.default,
        text: 'queue.maximum.waiting.caller'
    },
}
