import i18n from "@/i18n";

export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'

export const PERCENTAGE_TYPE = 'percentage'
export const PRIMARY_TYPE = 'primary'
export const OTHER_STATISTIC_LABEL = '% of Other'


export const PERCENTAGE_COUNTERS = () => ({
    1: {
        label: i18n.t('Answer'),
        key: '1',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('Abandoned'),
        key: '2',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('IVRExit'),
        key: '3',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('PickUp'),
        key: '4',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('TimeOutExit'),
        key: '5',
        value: 0,
        icon: '',
        color: ''
    },
    6: {
        label: i18n.t('JoinEmpty'),
        key: '6',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('LeavEempty'),
        key: '7',
        value: 0,
        icon: '',
        color: ''
    },
    8: {
        label: i18n.t('JoinUnavail'),
        key: '8',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('LeaveUnavail'),
        key: '9',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('Full'),
        key: '10',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('NextDestination'),
        key: '11',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('CallCount'),
        key: TOTAL_CALLS_KEY,
        value: 0,
        icon: 'IconIncoming',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('MaxRingTime'),
        key: 'MaxRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('NotInSLACount'),
        key: 'NotInSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('InSLACount'),
        key: 'InSLACount',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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
        label: i18n.t('AvgRingTime'),
        key: 'AvgRingTime',
        value: 0,
        icon: '',
        layout: {
            minWidth: '320',
            maxWidth: '320',
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

