export const dynamicRows = ['status', 'status_duration']

// Real Time Table suggestive word/key
export const realTimeTableKey = 'GetDataByUser'

export const dynamicColumns = [{
    prop: 'user_name',
    fixed: false,
    align: 'center',
    label: 'User Name',
}, {
    prop: 'extension_name',
    fixed: false,
    align: 'center',
    label: 'Extension Name',
}, {
    prop: 'status',
    fixed: false,
    align: 'center',
    label: 'Status',
}, {
    prop: 'status_duration',
    fixed: false,
    align: 'center',
    label: 'Current Status Duration',
    width: '250px',
}, {
    prop: 'caller_info',
    fixed: false,
    align: 'center',
    label: 'Caller Info',
    sortable: false,
}, {
    prop: 'call_info',
    fixed: false,
    align: 'center',
    label: 'Call Info',
    sortable: false,
}]
