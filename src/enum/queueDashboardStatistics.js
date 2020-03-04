export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'

export const PERCENTAGE_TYPE = 'percentage'
export const PRIMARY_TYPE = 'primary'
export const OTHER_STATISTIC_LABEL = '% of Other'

export const PERCENTAGE_COUNTERS = () => ({
    1: {
        label: 'Answer',
        key: 1,
        value: null,
        icon: '',
        style: {
            'color': 'red'
        }
    },
    2: {
        label: 'Abandoned',
        key: 2,
        value: null,
        icon: '',
        style: {
            color: 'green'
        }
    },
    3: {
        label: 'IVRExit',
        key: 3,
        value: null,
        icon: '',
        style: ''
    },
    4: {
        label: 'PickUp',
        key: 4,
        value: null,
        icon: '',
        style: ''
    },
    5: {
        label: 'TimeOutExit',
        key: 5,
        value: null,
        icon: '',
        style: ''
    },
    6: {
        label: 'JoinEmpty',
        key: 6,
        value: null,
        icon: '',
        style: ''
    },
    7: {
        label: 'LeavEempty',
        key: 7,
        value: null,
        icon: '',
        style: ''
    },
    8: {
        label: 'JoinUnavail',
        key: 8,
        value: null,
        icon: '',
        style: ''
    },
    9: {
        label: 'LeaveUnavail',
        key: 9,
        value: null,
        icon: '',
        style: ''
    },
    10: {
        label: 'Full',
        key: 10,
        value: null,
        icon: '',
        style: ''
    },
    11: {
        label: 'NextDestination',
        key: 11,
        value: null,
        icon: '',
        style: ''
    },
})

export const PRIMARY_COUNTERS = () => ({
    [TOTAL_CALLS_KEY]: {
        label: TOTAL_CALLS_KEY,
        key: TOTAL_CALLS_KEY,
        value: null,
        icon: 'IconIncoming',
        style: '',
    },
    MaxRingTime: {
        label: 'MaxRingTime',
        key: 'MaxRingTime',
        value: null,
        icon: '',
        style: '',
    },
    NotInSLACount: {
        label: 'NotInSLACount',
        key: 'NotInSLACount',
        value: null,
        icon: '',
        style: '',
    },
    InSLACount: {
        label: 'InSLACount',
        key: 'InSLACount',
        value: null,
        icon: '',
        style: {
            color: "blue",
        },
    },
    AvgRingTime: {
        label: 'AvgRingTime',
        key: 'AvgRingTime',
        value: null,
        icon: '',
        style: {
            border: '1px solid #8B008B'
        },
    },
})

let allStatistics = {
    ...PRIMARY_COUNTERS(),
    ...PERCENTAGE_COUNTERS()
}

export const statistics = Object.values(allStatistics)

