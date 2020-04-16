import colors from "@/enum/colors";
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

export function formatQueueDashboardsData (records, displayRowWithTotals, displayQueueAsColumn, columnsAreManaged) {

    if (!displayQueueAsColumn) {
        return queueAsRows(records, displayRowWithTotals, columnsAreManaged)
    }

    return queueAsColumns(records, displayRowWithTotals, columnsAreManaged)
}

function queueAsRows (records, displayRowWithTotals, columnsAreManaged) {

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

    let rowsData = queueAsColumns(records, true, columnsAreManaged).data

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


function queueAsColumns (records, displayRowWithTotals, columnsAreManaged) {

    let additionalColumns = {
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
    }

    const tableColumns = {
        'queue_id': '',
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

        rowData.MaxRingTime = timeFormatter(rowData.MaxRingTime)
        rowData.AvgRingTime = timeFormatter(rowData.AvgRingTime)

        const additionalData = column[ADDITIONAL_DATA_KEY]
        const additionalRows = Object.keys(additionalColumns)
        let qTotalCalls = column[TOTAL_CALLS_KEY] || 1

        allQueueCalls += Number(qTotalCalls)

        for (let statistic of additionalData) {
            const columnName = additionalRows[statistic['billing_cdr_queue_type']]

            if (!columnName) {
                return
            }

            rowData[columnName] = `${((statistic['ExitTypeCount'] * 100) / qTotalCalls).toFixed(2)} %`

            if (displayRowWithTotals) {
                queueTotals[columnName] += Number(statistic['ExitTypeCount'])
                if (index === recordsCount - 1) {
                    queueTotals[columnName] = `${((Number(queueTotals[columnName]) * 100) / allQueueCalls).toFixed(2)} %`
                }
            }

        }

        delete rowData[ADDITIONAL_DATA_KEY]
        delete rowData.queue_id

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
