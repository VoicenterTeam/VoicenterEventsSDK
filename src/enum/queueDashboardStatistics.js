export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'

export const PERCENTAGE_TYPE = 'percentage'
export const PRIMARY_TYPE = 'primary'
export const OTHER_STATISTIC_LABEL = '% of Other'

export const PERCENTAGES = {
    1: {
        label: 'Answer',
        value: 1,
        icon: '',
        style: {
            'color': 'red'
        }
    },
    2: {
        label: 'Abandoned',
        value: 2,
        icon: '',
        style: {
            color: 'green'
        }
    },
    3: {
        label: 'IVRExit',
        value: 3,
        icon: '',
        style: ''
    },
    4: {
        label: 'PickUp',
        value: 4,
        icon: '',
        style: ''
    },
    5: {
        label: 'TimeOutExit',
        value: 5,
        icon: '',
        style: ''
    },
    6: {
        label: 'JoinEmpty',
        value: 6,
        icon: '',
        style: ''
    },
    7: {
        label: 'LeavEempty',
        value: 7,
        icon: '',
        style: ''
    },
    8: {
        label: 'JoinUnavail',
        value: 8,
        icon: '',
        style: ''
    },
    9: {
        label: 'LeaveUnavail',
        value: 9,
        icon: '',
        style: ''
    },
    10: {
        label: 'Full',
        value: 10,
        icon: '',
        style: ''
    },
    11: {
        label: 'NextDestination',
        value: 11,
        icon: '',
        style: ''
    },
}

export const BASE_COUNTERS = {
    [TOTAL_CALLS_KEY]: {
        label: TOTAL_CALLS_KEY,
        value: 'CallCount',
        icon: 'IconIncoming',
        style: '',
    },
    MaxRingTime: {
        label: 'MaxRingTime',
        value: 'MaxRingTime',
        icon: '',
        style: '',
    },
    NotInSLACount: {
        label: 'NotInSLACount',
        value: 'NotInSLACount',
        icon: '',
        style: '',
    },
    InSLACount: {
        label: 'InSLACount',
        value: 'InSLACount',
        icon: '',
        style: {
            color: "blue",
        },
    },
    AvgRingTime: {
        label: 'AvgRingTime',
        value: 'AvgRingTime',
        icon: '',
        style: {
            border: '1px solid #8B008B'
        },
    },
    [ADDITIONAL_DATA_KEY]: [],
}

let allStatistics = {
    ...BASE_COUNTERS,
    ...PERCENTAGES
}

delete allStatistics[ADDITIONAL_DATA_KEY]

export const statistics = Object.values(allStatistics)

