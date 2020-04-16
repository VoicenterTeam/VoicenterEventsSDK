import colors from "@/enum/colors";
import sumBy from 'lodash/sumBy'
import groupBy from 'lodash/groupBy'

import {timeFormatter} from "@/helpers/timeFormatter";
import {ADDITIONAL_DATA_KEY, TOTAL_CALLS_KEY} from "@/enum/queueDashboardStatistics";

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
export const allColumns = [
    {
        "prop": "queue_id",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Queue Name"
    },
    {
        "prop": "Callers",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Callers"
    },
    {
        "prop": "MaxWaitTime",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "MaxWaitTime"
    },
    {
        "prop": "Answer",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Answer"
    },
    {
        "prop": "Abandoned",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Abandoned"
    },
    {
        "prop": "IVRExit",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "IVR Exit"
    },
    {
        "prop": "PickUp",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "PickUp"
    },
    {
        "prop": "TimeOutExit",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "TimeOut Exit"
    },
    {
        "prop": "JoinEmpty",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Join Empty"
    },
    {
        "prop": "LeaveEmpty",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "LeaveEmpty"
    },
    {
        "prop": "JoinUnavail",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Join Unavailable"
    },
    {
        "prop": "LeaveUnavail",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Leave Unavailable"
    },
    {
        "prop": "Full",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Full"
    },
    {
        "prop": "NextDestination",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Next Destination"
    },
    {
        "prop": "CallCount",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Call Count"
    },
    {
        "prop": "MaxRingTime",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Max Ring Time"
    },
    {
        "prop": "NotInSLACount",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Not in SLA Count"
    },
    {
        "prop": "InSLACount",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "In SLA Count"
    },
    {
        "prop": "AvgRingTime",
        "fixed": false,
        "align": "center",
        "minWidth": 130,
        "label": "Avg Ring Time"
    }
]

export const defaultVisibleColumns = [
    'queue_id',
    'Callers',
    'MaxWaitTime',
    'Answer',
    'Abandoned',
    'CallCount',
    'MaxRingTime',
    'NotInSLACount',
    'InSLACount',
    'AvgRingTime',
]

export function formatQueueDashboardsData (records, displayRowWithTotals, displayQueueAsColumn) {

    if (!displayQueueAsColumn) {
        return queueAsRows(records, displayRowWithTotals)
    }

    return queueAsColumns(records, displayRowWithTotals)
}

function queueAsRows (records, displayRowWithTotals) {

    let columns = {}
    let data = []

    records.forEach((column) => {
        const columnToAdd = {
            [column['queue_id']]: ''
        }
        columns = {
            ...columns,
            ...columnToAdd
        }
    })

    let rowsData = queueAsColumns(records, true).data

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
        data: data
    }
}

function queueAsColumns (records, displayRowWithTotals) {

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

    const tableColumns = {
        'queue_id': '',
        'Answer': 0,
        'Abandoned': 0,
        'IVRExit': 0,
        'PickUp': 0,
        'TimeOutExit': 0,
        'JoinEmpty': 0,
        'LeaveEmpty': 0,
        'JoinUnavail': 0,
        'LeaveUnavail': 0,
        'Full': 0,
        'NextDestination': 0,
        'CallCount': 0,
        'MaxRingTime': 0,
        'NotInSLACount': 0,
        'InSLACount': 0,
        'AvgRingTime': 0,
    }

    let data = []
    let queueTotals = tableColumns

    let exitTypeCounts = []
    let allQueueCalls = 1

    records.forEach((column) => {
        let rowData = {
            ...tableColumns,
            ...column
        }

        rowData.MaxRingTime = timeFormatter(rowData.MaxRingTime)
        rowData.AvgRingTime = timeFormatter(rowData.AvgRingTime)

        const additionalData = column[ADDITIONAL_DATA_KEY]

        let qTotalCalls = column[TOTAL_CALLS_KEY] || 1

        allQueueCalls += Number(qTotalCalls)

        for (let statistic of additionalData) {
            const columnName = billingCdrQueueTypes[statistic['billing_cdr_queue_type']]

            rowData[columnName] = `${((statistic['ExitTypeCount'] * 100) / qTotalCalls).toFixed(2)} %`

            if (displayRowWithTotals) {
                exitTypeCounts.push(statistic)
            }
        }

        delete rowData[ADDITIONAL_DATA_KEY]

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

        let statistics = groupBy(exitTypeCounts, 'billing_cdr_queue_type')

        for (let key in statistics) {
            const columnName = billingCdrQueueTypes[key]
            let value = sumBy(statistics[key], 'ExitTypeCount')
            queueTotals[columnName] = `${((Number(value) * 100) / allQueueCalls).toFixed(2)} %`
        }

        queueTotals.queue_id = 'All'
        queueTotals.MaxRingTime = timeFormatter(queueTotals.MaxRingTime)
        queueTotals.AvgRingTime = timeFormatter(queueTotals.AvgRingTime)
        data.splice(0, 0, queueTotals)
    }

    return {
        columns: tableColumns,
        data: data
    }
}
