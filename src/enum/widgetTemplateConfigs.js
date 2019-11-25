export const componentTypes = {
    1: {
        name: 'Input',
        type: 'text'
    },
    2: {
        name: 'Input',
        type: 'number'
    },
    3: {
        name: 'Date',
        type: 'date'
    },
    4: {
        name: 'Input',
        type: 'number'
    },
    5: {
        name: 'Select',
        type: 'select'
    },
    6: {
        name: 'AutoComplete',
        type: 'multiple'
    }
}

export const filterIDs = [1, 4, 5, 7, 18, 19, 21, 25, 26, 32]

export const filters = {
    1: {
        ParameterName: '{|User_ID_id_list|}',
        EndPoint: '/User/List/',
        label: 'UserName',
        value: 'UserID',
    },
    4: {
        ParameterName: '{|User_ID_id_list|}',
        EndPoint: '/User/List/',
        label: 'UserName',
        value: 'UserID',
    },
    5: {
        ParameterName: '{|extension_list|}',
        EndPoint: '/Extension/List/',
        label: 'Domain',
        value: 'ID',
    },
    7: {
        ParameterName: '{|did_list|}',
        EndPoint: '/DID/List/',
        label: 'DIDNumber',
        value: 'DIDID',
    },
    18: {
        ParameterName: '{|queue_list|}',
        EndPoint: '/Queue/List/',
        label: 'QueueName',
        value: 'QueueID',
    },
    //
    19: {
        ParameterName: '{|Group_By_Min|}',
        EndPoint: '/User/List/',
        label: 'CallGroupID',
        value: 'CallGroupName',
    },
    //
    21: {
        ParameterName: '{|Distributor_ID_id_list|}',
        EndPoint: '​/AccountIp/List/',
        label: 'AccountName',
        value: 'AccountID',
    },
    //
    25: {
        ParameterName: '{|AutomaticCampaign_list|}',
        EndPoint: '/User/List/',
        label: 'UserName',
        value: 'UserID',
    },
    26: {
        ParameterName: '{|Campaign_list|}',
        EndPoint: '/User/List/',
        label: 'UserName',
        value: 'UserID',
    },
    32: {
        ParameterName: '{|User_ID_id_list|}',
        EndPoint: '/User/List/',
        label: 'UserName',
        value: 'UserID',
    },
}

export const otherFilters = {
    2: {
        ParameterName: '{|chart_field_end_hour_day|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    3: {
        ParameterName: '{|chart_field_start_hour_day|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    6: {
        ParameterName: '{|target_duration|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    13: {
        ParameterName: '{|Abonden_Sec_max|}',
        ParameterType: 4,
        EndPoint: '/User/List/'
    },
    14: {
        ParameterName: '{|Abonden_Sec|}',
        ParameterType: 4,
        EndPoint: '/User/List/'
    },
    15: {
        ParameterName: '{|SLA_Time|}',
        ParameterType: 4,
        EndPoint: '/User/List/'
    },
    16: {
        ParameterName: '{|SLA_Time_B|}',
        ParameterType: 4,
        EndPoint: '/User/List/'
    },
    17: {
        ParameterName: '{|SLA_Time_C|}',
        ParameterType: 4,
        EndPoint: '/User/List/'
    },
    20: {
        ParameterName: '{|CustomDuration|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    22: {
        ParameterName: '{|Success_duartion|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    23: {
        ParameterName: '{|Recurring_Calls_Thresh|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    24: {
        ParameterName: '{|MaxPostAbandonmentTime|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    27: {
        ParameterName: '{|HoursOfWorkPerDay|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    28: {
        ParameterName: '{|LastCallDelayMinAlert|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    29: {
        ParameterName: '{|LunchTimeAlert|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    30: {
        ParameterName: '{|ShiftOffsetTime|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
    31: {
        ParameterName: '{|OffsetTimeTest|}',
        ParameterType: 2,
        EndPoint: '/User/List/'
    },
}
