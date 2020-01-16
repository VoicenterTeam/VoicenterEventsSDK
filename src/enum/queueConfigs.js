import i18n from '@/i18n'

export const activeCallColumns = [{
    prop: 'QueueName',
    fixed: false,
    align: 'center',
    label: 'Queue Name',
    sortable: true
}, {
    prop: 'CallerNumber',
    fixed: false,
    align: 'center',
    label: 'Caller Number'
}, {
    prop: 'CallerName',
    fixed: false,
    align: 'center',
    label: 'Caller Name',
    sortable: true
}, {
    prop: 'WaitingTime',
    fixed: false,
    align: 'center',
    label: 'Waiting Time',
    sortable: true
}]

export const allSeries = [
    {
        label: i18n.t('queue.maximum.waiting.time'),
        value: 0
    },
    {
        label: i18n.t('queue.amount.callers.waiting'),
        value: 1
    },
    {
        label: i18n.t('queue.agents.available'),
        value: 2
    },
    {
        label: i18n.t('queue.agents.on.a.call'),
        value: 3
    },
    {
        label: i18n.t('queue.agents.on.administrative.break'),
        value: 4
    },
    {
        label: i18n.t('queue.agents.on.break'),
        value: 5
    }
]
