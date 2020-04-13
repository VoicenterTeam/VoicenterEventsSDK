import colors from '@/enum/colors'
import {timeFormatter} from "@/helpers/timeFormatter";

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
            frames: colors.LIGHT_GREEN,
            fonts: colors.LIGHT_GREEN
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
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
            frames: colors.LOGIN_COLOR,
            fonts: colors.LOGIN_COLOR
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
            frames: colors.ADMINISTRATIVE_COLOR,
            fonts: colors.ADMINISTRATIVE_COLOR
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
            frames: colors.LUNCH_COLOR,
            fonts: colors.LUNCH_COLOR
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR
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
            frames: colors.OTHER_COLOR,
            fonts: colors.OTHER_COLOR
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR
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
            frames: colors.LIGHT_GREEN,
            fonts: colors.LIGHT_GREEN,
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
            frames: colors.PRIVATE_COLOR,
            fonts: colors.PRIVATE_COLOR,
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
            frames: colors.LOGOUT_COLOR,
            fonts: colors.LOGOUT_COLOR,
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
            frames: colors.LUNCH_COLOR,
            fonts: colors.LUNCH_COLOR,
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

export const activitiesToDisplay = [
    {
        key: 'InSLACount',
        value: 'InSLACount',
    },
    {
        key: 'AnswerCount',
        value: 'AnswerCount',
    }
]

export const queueActivities = [
    'InSLACount', 'AnswerCount'
]

export const queueDashboardColumnStyles = {
    'Answer': {
        color: colors.LIGHT_GREEN,
    },
    'Abandoned': {
        color: colors.PRIVATE_COLOR,
    },
    'IVRExit': {
        color: colors.PRIVATE_COLOR,
    },
    'PickUp': {
        color: colors.LOGIN_COLOR,
    },
    'TimeOutExit': {
        color: colors.ADMINISTRATIVE_COLOR,
    },
    'JoinEmpty': {
        color: colors.LUNCH_COLOR,
    },
    'LeavEempty': {
        color: colors.PRIVATE_COLOR,
    },
    'JoinUnavail': {
        color: colors.LOGOUT_COLOR,
    },
    'LeaveUnavail': {
        color: colors.PRIVATE_COLOR,
    },
    'Full': {
        color: colors.OTHER_COLOR,
    },
    'NextDestination': {
        color: colors.LOGOUT_COLOR,
    },
}

export function formatQueueDashboardsData (records, displayRowWithTotals) {

    const additionalColumns = {
        'Answer': 0,
        'Abandoned': 0,
        'IVRExit': 0,
        'PickUp': 0,
        'TimeOutExit': 0,
        'JoinEmpty': 0,
        'LeavEempty': 0,
        'JoinUnavail': 0,
        'LeaveUnavail': 0,
        'Full': 0,
        'NextDestination': 0,
    }

    const tableColumns = {
        'QueueName': '',
        ...additionalColumns,
        'CallCount': 0,
        'MaxRingTime': 0,
        'NotInSLACount': 0,
        'InSLACount': 0,
        'AvgRingTime': 0,
    }

    let data = []
    let queueTotals = tableColumns

    const recordsCount = records.length
    let allQueueCalls = 1

    records.forEach((column, index) => {
        let rowData = {
            ...tableColumns,
            ...column
        }

        rowData['queue_id'] = column['queue_id']

        rowData.MaxRingTime = timeFormatter(rowData.MaxRingTime)
        rowData.AvgRingTime = timeFormatter(rowData.AvgRingTime)

        const additionalData = column[ADDITIONAL_DATA_KEY]
        const additionalRows = Object.keys(additionalColumns)
        let qTotalCalls = column[TOTAL_CALLS_KEY] || 1

        allQueueCalls += Number(qTotalCalls)

        for (let statistic of additionalData) {
            const columnName = additionalRows[statistic['billing_cdr_queue_type']]
            rowData[columnName] = `${((statistic['ExitTypeCount'] * 100) / qTotalCalls).toFixed(2)} %`
            if (displayRowWithTotals) {
                queueTotals[columnName] += Number(statistic['ExitTypeCount'])
                if (index === recordsCount - 1) {
                    queueTotals[columnName] = `${((Number(queueTotals[columnName]) * 100) / allQueueCalls).toFixed(2)} %`
                }
            }
        }

        // delete rowData[ADDITIONAL_DATA_KEY]

        if (displayRowWithTotals) {
            queueTotals.CallCount += column.CallCount
            queueTotals.MaxRingTime += column.MaxRingTime
            queueTotals.NotInSLACount += column.NotInSLACount
            queueTotals.InSLACount += column.InSLACount
            queueTotals.AvgRingTime += column.AvgRingTime
        }

        data.push(rowData)
    })

    if (displayRowWithTotals) {
        queueTotals['queue_id'] = 'ALL'
        data.splice(0, 1, queueTotals)
    }

    return {
        columns: tableColumns,
        data: data
    }
}
