export const dynamicRows = ['status', 'status_duration']

export const dynamicColumns = [{
    prop: 'user_name',
    fixed: false,
    align: 'center',
    label: 'User Name',
}, {
    prop: 'status',
    fixed: false,
    align: 'center',
    label: 'Status'
}, {
    prop: 'status_duration',
    fixed: false,
    align: 'center',
    label: 'Current Status Duration',
    width: '250px'
}]

//The DB query should be happening every 10 seconds
export const refreshDataInterval = 10000
