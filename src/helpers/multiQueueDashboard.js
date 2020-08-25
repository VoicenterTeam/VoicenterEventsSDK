import colors from '@/enum/colors'
import sumBy from 'lodash/sumBy'
import groupBy from 'lodash/groupBy'

import { timeFormatter } from '@/helpers/timeFormatter'
import { ADDITIONAL_DATA_KEY, TOTAL_CALLS_KEY } from '@/enum/queueDashboardStatistics'

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
    'LeaveEmpty': {
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

export const defaultVisibleColumns = [
    'queue_id',
    'Callers',
    'CurrentWaitTime',
    'Answer',
    'Abandoned',
    'CallCount',
    'MaxRingTime',
    'NotInSLACount',
    'InSLACount',
    'AvgRingTime',
]

export function formatQueueDashboardsData(records, displayRowWithTotals, displayQueueAsRows, showStatsInPercentage) {

    if (displayQueueAsRows) {
        return queueAsRows(records, displayRowWithTotals, showStatsInPercentage)
    }

    return queueAsColumns(records, displayRowWithTotals, showStatsInPercentage)
}

function queueAsRows(records, displayRowWithTotals, showStatsInPercentage) {

    let columns = {}
    let data = []

    records.forEach((column) => {
        const columnToAdd = {
            [column['queue_id']]: '',
        }
        columns = {
            ...columns,
            ...columnToAdd,
        }
    })

    let rowsData = queueAsColumns(records, true, showStatsInPercentage).data

    const queueIds = Object.keys(columns)
    const rowsDataKeys = Object.keys(rowsData[0])

    for (let i = 0; i < rowsDataKeys.length; i++) {
        let dataObject = {}
        dataObject['All'] = rowsDataKeys[i + 1]

        for (let j = 0; j < queueIds.length; j++) {
            dataObject = {
                ...dataObject,
                //i+1: Prevent insert QueueName values
                //j+1: Prevent insert Queue totals values
                [queueIds[j]]: rowsData[j + 1][rowsDataKeys[i + 1]],
                All: rowsData[0][rowsDataKeys[i + 1]],
            }
        }
        dataObject['Stat type'] = rowsDataKeys[i + 1]
        data.push(dataObject)
    }

    columns['Stat type'] = ''

    if (displayRowWithTotals) {
        columns['All'] = ''
    }

    return {
        columns: columns,
        data: data,
    }
}

function queueAsColumns(records, displayRowWithTotals, showStatsInPercentage) {
    let billingCdrQueueTypes = {
        1: 'Answer',
        2: 'Abandoned',
        3: 'IVRExit',
        4: 'PickUp',
        5: 'TimeOutExit',
        6: 'JoinEmpty',
        7: 'LeaveEmpty',
        8: 'JoinUnavail',
        9: 'LeaveUnavail',
        10: 'Full',
        11: 'NextDestination',
    }

    let tableColumns = {
        'queue_id': '',
        'Callers': '',
        'CurrentWaitTime': '',
        'Answer': '0 %',
        'Abandoned': '0 %',
        'IVRExit': '0 %',
        'PickUp': '0 %',
        'TimeOutExit': '0 %',
        'JoinEmpty': '0 %',
        'LeaveEmpty': '0 %',
        'JoinUnavail': '0 %',
        'LeaveUnavail': '0 %',
        'Full': '0 %',
        'NextDestination': '0 %',
        'CallCount': 0,
        'MaxRingTime': 0,
        'NotInSLACount': 0,
        'InSLACount': 0,
        'AvgRingTime': 0,
    }

    if (!showStatsInPercentage) {
        tableColumns = {
            'queue_id': '',
            'Callers': '',
            'CurrentWaitTime': '',
            'Answer': '0',
            'Abandoned': '0',
            'IVRExit': '0',
            'PickUp': '0',
            'TimeOutExit': '0',
            'JoinEmpty': '0',
            'LeaveEmpty': '0',
            'JoinUnavail': '0',
            'LeaveUnavail': '0',
            'Full': '0',
            'NextDestination': '0',
            'CallCount': 0,
            'MaxRingTime': 0,
            'NotInSLACount': 0,
            'InSLACount': 0,
            'AvgRingTime': 0,
        }
    }

    let data = []
    let queueTotals = tableColumns

    let exitTypeCounts = []
    let allQueueCalls = 0

    let maxRingTime = []

    records.forEach((column) => {
        let rowData = {
            ...tableColumns,
            ...column,
        }

        const additionalData = column[ADDITIONAL_DATA_KEY]

        let qTotalCalls = column[TOTAL_CALLS_KEY] || 0

        rowData.MaxRingTime = timeFormatter(rowData.MaxRingTime)
        const avgRingTime = qTotalCalls * rowData.AvgRingTime
        rowData.AvgRingTime = timeFormatter(rowData.AvgRingTime)

        allQueueCalls += Number(qTotalCalls)

        for (let statistic of additionalData) {
            const columnName = billingCdrQueueTypes[statistic['billing_cdr_queue_type']]

            if (showStatsInPercentage) {
                rowData[columnName] = `${((statistic['ExitTypeCount'] * 100) / qTotalCalls).toFixed(2)} %`
            } else {
                rowData[columnName] = statistic['ExitTypeCount']
            }

            if (displayRowWithTotals) {
                exitTypeCounts.push(statistic)
            }
        }

        delete rowData[ADDITIONAL_DATA_KEY]

        if (displayRowWithTotals) {
            maxRingTime.push(Number(column.MaxRingTime))
            queueTotals.AvgRingTime += Number(avgRingTime)
            queueTotals.CallCount += Number(column.CallCount)
            queueTotals.NotInSLACount += column.NotInSLACount
            queueTotals.InSLACount += column.InSLACount
        }

        data.push(rowData)
    })

    if (displayRowWithTotals) {

        let statistics = groupBy(exitTypeCounts, 'billing_cdr_queue_type')

        for (let key in statistics) {
            const columnName = billingCdrQueueTypes[key]
            let value = sumBy(statistics[key], 'ExitTypeCount')
            if (showStatsInPercentage) {
                queueTotals[columnName] = `${((Number(value) * 100) / allQueueCalls).toFixed(2)}`
            } else {
                queueTotals[columnName] = value
            }
        }

        queueTotals.queue_id = 'All'
        maxRingTime = Math.max(...maxRingTime)

        const avgRingTime = Math.ceil(queueTotals.AvgRingTime / allQueueCalls) || 0

        queueTotals.AvgRingTime = timeFormatter(avgRingTime)
        queueTotals.MaxRingTime = timeFormatter(maxRingTime)

        data.splice(0, 0, queueTotals)
    }

    return {
        columns: tableColumns,
        data: data,
    }
}
