import i18n from '@/i18n'

import { defaultQueueChartColors } from './defaultWidgetSettings';

export const activeCallColumns = [{
    prop: 'QueueName',
    fixed: false,
    align: 'center',
    label: i18n.t('queue.queueName'),
    sortable: true
}, {
    prop: 'CallerNumber',
    fixed: false,
    align: 'center',
    label: i18n.t('queue.callerNumber'),
}, {
    prop: 'CallerName',
    fixed: false,
    align: 'center',
    label: i18n.t('queue.callerName'),
    sortable: true
}, {
    prop: 'CallerID',
    fixed: false,
    align: 'center',
    label: i18n.t('CallerID'),
    sortable: true
}, {
    prop: 'WaitingTime',
    fixed: false,
    align: 'center',
    label: i18n.t('queue.waitingTime'),
    sortable: true
}]

export const activeGaugeCallColumns = [{
    prop: 'Id',
    fixed: false,
    align: 'center',
    label: '#',
    sortable: false
}, {
    prop: 'CallerID',
    fixed: false,
    align: 'center',
    label: i18n.t('CallerID'),
    sortable: false
}, {
    prop: 'WaitingTime',
    fixed: false,
    align: 'center',
    label: i18n.t('Waiting Time'),
    sortable: false
}]

export const DEFAULT_CHART_SERIES_LINES_KEYS = {
    MAX_WAITING_TIME: {
        key: 'MAX_WAITING_TIME',
        serieType: 'line',
        name: i18n.t('call.maxWaitingTime'),
        colorVar: 'maxWaitingTime',
        colorDefault: defaultQueueChartColors.maxWaitingTime
    },
    QUEUE_CALLS: {
        key: 'QUEUE_CALLS',
        serieType: 'line',
        name: i18n.t('call.queueCalls'),
        colorVar: 'queueCalls',
        colorDefault: defaultQueueChartColors.queueCalls
    },
    AGENTS_ON_HOLD: {
        key: 'AGENTS_ON_HOLD',
        serieType: 'column',
        name: i18n.t('status.hold'),
        layoutColorVar: 'onHold',
        colorDefault: '#E53E3E'
    },
    AGENTS_IN_CALL: {
        key: 'AGENTS_IN_CALL',
        serieType: 'column',
        name: i18n.t('status.incall'),
        layoutColorVar: 'inCall',
        colorDefault: '#5EB300'
    }
}

export const getAllSeries = (accountStatuses) => {
    return [
        ...Object.values(DEFAULT_CHART_SERIES_LINES_KEYS).map(DEFAULT_CHART_SERIE => {
            return {
                value: DEFAULT_CHART_SERIE.key,
                label: DEFAULT_CHART_SERIE.name
            }
        }),
        ...accountStatuses.map(accountStatus => {
                return {
                    value: accountStatus.StatusID,
                    label: accountStatus.Name
                }
            })
        ]
}
