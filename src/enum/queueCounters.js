import config from '@/config'

export const typeKeys = {
    CALLERS_ID: 0,
    MAXIMUM_WAITING_ID: 1,
}
//TODO: update icons if will be necessary
export const types = {
    [`${typeKeys.CALLERS_ID}`]: {
        icon: 'IconIncomingCall',
        color: config.colors.light_green,
        text: 'queue.counter.callers',
    },
    [`${typeKeys.MAXIMUM_WAITING_ID}`]: {
        icon: 'IconAdministrative',
        color: config.colors.default,
        text: 'queue.maximum.waiting.caller',
    },
}

export const typeNames = [
    'queue.counter.callers',
    'queue.maximum.waiting.caller',
]

export const availableCounters = [
    {
        label: 'Average duration of all calls',
        value: 'Average duration of all calls',
    },
    {
        label: 'Average duration of incoming calls',
        value: 'Average duration of incoming calls',
    },
    {
        label: 'Average duration of outgoing calls',
        value: 'Average duration of outgoing calls',
    },
]
