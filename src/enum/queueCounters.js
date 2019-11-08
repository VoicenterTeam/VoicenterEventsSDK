import config from '@/config'

export const typeKeys = {
    CALLERS_ID: 0,
    MAXIMUM_WAITING_ID: 1
}

export const types = {
    [`${typeKeys.CALLERS_ID}`]: {
        icon: "IconIncomingCall",
        color: config.colors.info,
        text: 'queue.counter.callers'
    },
    [`${typeKeys.MAXIMUM_WAITING_ID}`]: {
        icon: "IconTeamMeeting",
        color: config.colors.default,
        text: 'queue.maximum.waiting.caller'
    },
}

export const typeNames = [
    'queue.counter.callers',
    'queue.maximum.waiting.caller'
]
