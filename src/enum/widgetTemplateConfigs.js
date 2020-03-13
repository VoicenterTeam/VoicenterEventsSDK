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
    ParameterName: '{|user_id_id_list|}',
    EndPoint: '/User/List/',
    label: 'user_name',
    value: 'user_id',
    EntitiesListKey: 'Users'
}

const campaignListConfig = {
    ParameterName: '{|campaign_list|}',
    EndPoint: '/User/List/',
    label: 'camp_name',
    value: 'camp_id',
    EntitiesListKey: 'Campaigns'
}

const extensionListConfig = {
    ParameterName: '{|extension_list|}',
    EndPoint: '/Extension/List/',
    label: 'ext_name',
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
    ParameterName: '{|distributor_id_id_list|}',
    EndPoint: '​/AccountIp/List/',
    label: 'dist_name',
    value: 'distributor_id',
    EntitiesListKey: 'Accounts'
}

export const filters = {
    '{|user_id_id_list|}': userListConfig,
    '{|extension_list|}': extensionListConfig,
    '{|did_list|}': didListConfig,
    '{|queue_list|}': queueListConfig,
    '{|distributor_id_id_list|}': accountListConfig,
    '{|campaign_list|}': campaignListConfig,
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
