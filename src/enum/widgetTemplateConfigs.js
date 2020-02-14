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
};

const userListConfig = {
    ParameterName: '{|User_ID_id_list|}',
    EndPoint: '/User/List/',
    label: 'user_name',
    value: 'user_id',
    EntitiesListKey: 'Users'
}

const campaignListConfig = {
    ParameterName: '{|Campaign_list|}',
    EndPoint: '/User/List/',
    label: 'camp_name',
    value: 'camp_id',
    EntitiesListKey: 'Campaigns'
}

const extensionListConfig = {
    ParameterName: '{|extension_list|}',
    EndPoint: '/Extension/List/',
    label: 'extension_name',
    value: 'extension_id',
    EntitiesListKey: 'Extension'
}

export const didListConfig = {
    ParameterName: '{|did_list|}',
    EndPoint: '/DID/List/',
    label: 'did_name',
    value: 'user_did_id',
    EntitiesListKey: 'DIDs'
}

const queueListConfig = {
    ParameterName: '{|queue_list|}',
    EndPoint: '/Queue/List/',
    label: 'q_name',
    value: 'queue_id',
    EntitiesListKey: 'Queues'
}

const accountListConfig = {
    ParameterName: '{|Distributor_ID_id_list|}',
    EndPoint: '​/AccountIp/List/',
    label: 'dist_name',
    value: 'distributor_id',
    EntitiesListKey: 'Accounts'
}

export const filterIDs = [1, 4, 5, 7, 18, 19, 21, 25, 26, 32, 33, 38, 40]

export const filters = {
    1: userListConfig,
    4: userListConfig,
    5: extensionListConfig,
    7: didListConfig,
    18: queueListConfig,
    19: accountListConfig,
    21: accountListConfig,
    25: campaignListConfig,
    26: campaignListConfig,
    32: userListConfig,
    33: userListConfig,
    38: queueListConfig,
    40: queueListConfig,
}

export const otherFilters = {
    2: {
        ParameterName: '{|chart_field_end_hour_day|}',
        ParameterType: 2,
    },
    3: {
        ParameterName: '{|chart_field_start_hour_day|}',
        ParameterType: 2,
    },
    6: {
        ParameterName: '{|target_duration|}',
        ParameterType: 2,
    },
    13: {
        ParameterName: '{|Abonden_Sec_max|}',
        ParameterType: 4,
    },
    14: {
        ParameterName: '{|Abonden_Sec|}',
        ParameterType: 4,
    },
    15: {
        ParameterName: '{|SLA_Time|}',
        ParameterType: 4,
    },
    16: {
        ParameterName: '{|SLA_Time_B|}',
        ParameterType: 4,
    },
    17: {
        ParameterName: '{|SLA_Time_C|}',
        ParameterType: 4,
    },
    20: {
        ParameterName: '{|CustomDuration|}',
        ParameterType: 2,
    },
    22: {
        ParameterName: '{|Success_duartion|}',
        ParameterType: 2,
    },
    23: {
        ParameterName: '{|Recurring_Calls_Thresh|}',
        ParameterType: 2,
    },
    24: {
        ParameterName: '{|MaxPostAbandonmentTime|}',
        ParameterType: 2,
    },
    27: {
        ParameterName: '{|HoursOfWorkPerDay|}',
        ParameterType: 2,
    },
    28: {
        ParameterName: '{|LastCallDelayMinAlert|}',
        ParameterType: 2,
    },
    29: {
        ParameterName: '{|LunchTimeAlert|}',
        ParameterType: 2,
    },
    30: {
        ParameterName: '{|ShiftOffsetTime|}',
        ParameterType: 2,
    },
    31: {
        ParameterName: '{|OffsetTimeTest|}',
        ParameterType: 2,
    },
}
