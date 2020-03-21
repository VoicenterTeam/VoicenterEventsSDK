import i18n from "@/i18n";
import colors from "@/enum/colors";

export const ADDITIONAL_DATA_KEY = 'ExitCounts'
export const TOTAL_CALLS_KEY = 'CallCount'

export const PERCENTAGE_TYPE = 'percentage'
export const PRIMARY_TYPE = 'primary'
export const OTHER_STATISTIC_LABEL = '% of Other'

export const PERCENTAGE_COUNTERS = () => ({
    1: {
        label: i18n.t('Answer'),
        key: 'Answer',
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
            frames: colors.LIGHT_GREEN,
            fonts: colors.LIGHT_GREEN
        }
    },
    2: {
        label: i18n.t('Abandoned'),
        key: 'Abandoned',
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
        }
    },
    3: {
        label: i18n.t('IVRExit'),
        key: 'IVRExit',
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
        }
    },
    4: {
        label: i18n.t('PickUp'),
        key: 'PickUp',
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
            frames: colors.LOGIN_COLOR,
            fonts: colors.LOGIN_COLOR
        }
    },
    5: {
        label: i18n.t('TimeOutExit'),
        key: 'TimeOutExit',
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
            frames: colors.ADMINISTRATIVE_COLOR,
            fonts: colors.ADMINISTRATIVE_COLOR
        }
    },
    6: {
        label: i18n.t('JoinEmpty'),
        key: 'JoinEmpty',
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
            frames: colors.LUNCH_COLOR,
            fonts: colors.LUNCH_COLOR
        }
    },
    7: {
        label: i18n.t('LeavEempty'),
        key: 'LeavEempty',
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
        }
    },
    8: {
        label: i18n.t('JoinUnavail'),
        key: 'JoinUnavail',
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR
        }
    },
    9: {
        label: i18n.t('LeaveUnavail'),
        key: 'LeaveUnavail',
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
        }
    },
    10: {
        label: i18n.t('Full'),
        key: 'Full',
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
            frames: colors.OTHER_COLOR,
            fonts: colors.OTHER_COLOR
        }
    },
    11: {
        label: i18n.t('NextDestination'),
        key: 'NextDestination',
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR
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
            minWidth: '340',
            maxWidth: '340',
            showText: true,
            showBorder: true,
        },
        colors: {
            background: "#ffffff",
            frames: colors.LIGHT_GREEN,
            fonts: colors.LIGHT_GREEN,
        }
    },
    MaxRingTime: {
        label: i18n.t('MaxRingTime'),
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR,
        }
    },
    NotInSLACount: {
        label: i18n.t('NotInSLACount'),
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR,
        }
    },
    InSLACount: {
        label: i18n.t('InSLACount'),
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
            frames: colors.LUNCH_COLOR,
            fonts: colors.LUNCH_COLOR,
        }
    },
    AvgRingTime: {
        label: i18n.t('AvgRingTime'),
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
            frames: colors.ADMINISTRATIVE_COLOR,
            fonts: colors.ADMINISTRATIVE_COLOR,
        }
    },
})

export let allStatistics = {
    ...PRIMARY_COUNTERS(),
    ...PERCENTAGE_COUNTERS()
}

export const statistics = Object.values(allStatistics)

