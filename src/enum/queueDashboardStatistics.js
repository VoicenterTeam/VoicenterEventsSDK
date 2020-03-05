export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'

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
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    2: {
        label: 'Abandoned',
        key: '2',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    3: {
        label: 'IVRExit',
        key: '3',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    4: {
        label: 'PickUp',
        key: '4',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    5: {
        label: 'TimeOutExit',
        key: '5',
        value: 0,
        icon: '',
        color: ''
    },
    6: {
        label: 'JoinEmpty',
        key: '6',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    7: {
        label: 'LeavEempty',
        key: '7',
        value: 0,
        icon: '',
        color: ''
    },
    8: {
        label: 'JoinUnavail',
        key: '8',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    9: {
        label: 'LeaveUnavail',
        key: '9',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    10: {
        label: 'Full',
        key: '10',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    11: {
        label: 'NextDestination',
        key: '11',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
})

export const PRIMARY_COUNTERS = () => ({
    [TOTAL_CALLS_KEY]: {
        label: TOTAL_CALLS_KEY,
        key: TOTAL_CALLS_KEY,
        value: 0,
        icon: 'IconIncoming',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    MaxRingTime: {
        label: 'MaxRingTime',
        key: 'MaxRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    NotInSLACount: {
        label: 'NotInSLACount',
        key: 'NotInSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    InSLACount: {
        label: 'InSLACount',
        key: 'InSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
    AvgRingTime: {
        label: 'AvgRingTime',
        key: 'AvgRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '200',
            maxWidth: '200',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: "#ff000000",
            fonts: '#000000'
        }
    },
})

export let allStatistics = {
    ...PRIMARY_COUNTERS(),
    ...PERCENTAGE_COUNTERS()
}

export const statistics = Object.values(allStatistics)

