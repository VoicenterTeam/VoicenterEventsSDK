import colors from '@/enum/colors'

export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'
export const MAX_RING_TIME_KEY = 'MaxRingTime'
export const AVG_RING_TIME_KEY = 'AvgRingTime'

export const PERCENTAGE_TYPE = 'percentage'
export const PRIMARY_TYPE = 'primary'
export const OTHER_STATISTIC_LABEL = '% of Other'

export const PERCENTAGE_COUNTERS = () => ({
    1: {
        label: 'Answer',
        key: '1',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LIGHT_GREEN,
            fonts: colors.QUEUE_LIGHT_GREEN
        }
    },
    2: {
        label: 'Abandoned',
        key: '2',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_PRIVATE_COLOR,
            fonts: colors.QUEUE_PRIVATE_COLOR
        }
    },
    3: {
        label: 'IVRExit',
        key: '3',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_PRIVATE_COLOR,
            fonts: colors.QUEUE_PRIVATE_COLOR
        }
    },
    4: {
        label: 'PickUp',
        key: '4',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LOGIN_COLOR,
            fonts: colors.QUEUE_LOGIN_COLOR
        }
    },
    5: {
        label: 'TimeOutExit',
        key: '5',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_ADMINISTRATIVE_COLOR,
            fonts: colors.QUEUE_ADMINISTRATIVE_COLOR
        }
    },
    6: {
        label: 'JoinEmpty',
        key: '6',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LUNCH_COLOR,
            fonts: colors.QUEUE_LUNCH_COLOR
        }
    },
    7: {
        label: 'LeavEempty',
        key: '7',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_PRIVATE_COLOR,
            fonts: colors.QUEUE_PRIVATE_COLOR
        }
    },
    8: {
        label: 'JoinUnavail',
        key: '8',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LOGOUT_COLOR,
            fonts: colors.QUEUE_LOGOUT_COLOR
        }
    },
    9: {
        label: 'LeaveUnavail',
        key: '9',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_PRIVATE_COLOR,
            fonts: colors.QUEUE_PRIVATE_COLOR
        }
    },
    10: {
        label: 'Full',
        key: '10',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_OTHER_COLOR,
            fonts: colors.QUEUE_OTHER_COLOR
        }
    },
    11: {
        label: 'NextDestination',
        key: '11',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LOGOUT_COLOR,
            fonts: colors.QUEUE_LOGOUT_COLOR
        }
    },
})

export const PRIMARY_COUNTERS = () => ({
    [TOTAL_CALLS_KEY]: {
        label: 'CallCount',
        key: TOTAL_CALLS_KEY,
        value: 0,
        icon: 'IconIncoming',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LIGHT_GREEN,
            fonts: colors.QUEUE_LIGHT_GREEN,
        }
    },
    [MAX_RING_TIME_KEY]: {
        label: 'MaxRingTime',
        key: 'MaxRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_PRIVATE_COLOR,
            fonts: colors.QUEUE_PRIVATE_COLOR,
        }
    },
    NotInSLACount: {
        label: 'NotInSLACount',
        key: 'NotInSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LOGOUT_COLOR,
            fonts: colors.QUEUE_LOGOUT_COLOR,
        }
    },
    InSLACount: {
        label: 'InSLACount',
        key: 'InSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_LUNCH_COLOR,
            fonts: colors.QUEUE_LUNCH_COLOR,
        }
    },
    [AVG_RING_TIME_KEY]: {
        label: 'AvgRingTime',
        key: 'AvgRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.QUEUE_ADMINISTRATIVE_COLOR,
            fonts: colors.QUEUE_ADMINISTRATIVE_COLOR,
        }
    },
})

export let allStatistics = {
    ...PRIMARY_COUNTERS(),
    ...PERCENTAGE_COUNTERS()
}

export const statistics = Object.values(allStatistics)

export const activitiesToDisplay = [
    {
        key: 'AnswerCount',
        value: 'AnswerCount',
    },
    {
        key: 'InSLACount',
        value: 'InSLACount',
    },

]

export const queueActivities = [
    'AnswerCount', 'InSLACount'
]
