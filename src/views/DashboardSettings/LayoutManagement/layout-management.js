import i18n from '@/i18n';

export const GLOBAL_LAYOUT_ID = 1
export const PRIMARY_COLOR_KEY = 'ColorPrimary'

export const globalAccountSettings = {
    'LayoutID': GLOBAL_LAYOUT_ID,
}

export const ENABLED_STATUS_ID = 1;
export const DELETED_STATUS_ID = 2;

export const ENABLED_STATUS_NAME = 'Enable';
export const DELETED_STATUS_NAME = 'Deleted';

export const availableLayouts = [{
    label: i18n.t('layout.activeLayouts'),
    statusID: ENABLED_STATUS_ID,
    statusName: ENABLED_STATUS_NAME,
    name: 'enabledLayouts',
}, {
    label: i18n.t('layout.recycleBin'),
    statusID: DELETED_STATUS_ID,
    statusName: DELETED_STATUS_NAME,
    name: 'deletedLayouts',
}]

export const statusDictionary = {
    1: 'enable layout',
    2: 'move layout to bin',
}

export const sliderOptionConfigs = {
    FontSize: {
        min: 8,
        max: 24,
        step: 1,
        marks: {
            9: '9px',
            16: '16px',
            20: '20px',
        },
    },
    WidgetTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1,
        marks: {
            16: '16px',
            24: '24px',
            40: '40px',
        },
    },
    WidgetGroupTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1,
        marks: {
            16: '16px',
            24: '24px',
            32: '32px',
        },
    },
    MinRefreshInterval: {
        min: 10,
        max: 1000,
        step: 10,
        marks: {
            100: '100s',
            200: '200s',
            400: '400s',
            600: '600s',
            800: '800s',
        },
    },
    RefreshRealTimeDataDelay: {
        min: 3,
        max: 90,
        step: 1,
        marks: {
            5: '5min',
            15: '15min',
            30: '30min',
            45: '45min',
            75: '75min',
        },
    },
    ReportInterval: {
        min: 10,
        max: 1000,
        step: 10,
        marks: {
            100: '120s',
            360: '360s',
            600: '600s',
            800: '800s',
        },
    },
    ActiveCallWarning: {
        min: 1,
        max: 7200,
        step: 5,
        marks: {
            900: '15min',
            1800: '30min',
            2700: '45min',
            3600: '1h',
            4700: '1:30h',
            6300: '1:45h',
        },
    },
    ActiveCallLimit: {
        min: 1,
        max: 7200,
        step: 5,
        marks: {
            900: '15min',
            1800: '30min',
            2700: '45min',
            3600: '1h',
            4700: '1:30h',
            6300: '1:45h',
        },
    },
    HoldTimeWarning: {
        min: 1,
        max: 7200,
        step: 5,
        marks: {
            900: '15min',
            1800: '30min',
            2700: '45min',
            3600: '1h',
            4700: '1:30h',
            6300: '1:45h',
        },
    },
    HoldTimeLimit: {
        min: 1,
        max: 7200,
        step: 5,
        marks: {
            900: '15min',
            1800: '30min',
            2700: '45min',
            3600: '1h',
            4700: '1:30h',
            6300: '1:45h',
        },
    },
}

export const predefinedColors = [
    '#F7FAFC',
    '#EDF2F6',
    '#38B2AC',
    '#4299E1',
    '#667EEA',
    '#9F7AEA',
    '#ED8936',
    '#D53F8C',
    '#E53E3E',
    '#000000',
]

export const DEFAULT_SELECTED_GROUP = 'Colors'

export const DEFAULT_LAYOUT_GROUPS = [
    'Colors',
    'Fonts',
    'Timers',
]

export const DEFAULT_GROUP_KEYS = {
    'Colors': [
        'ColorPrimary',
        'ColorBackground',
        'ColorFrames',
    ],
    'AllColors': [
        'ColorPrimary',
        'ColorBackground',
        'ColorFrames',
        'ColorWidgetGroupBackground',
        'ColorWidgetGroupFrames',
        'ColorWidgetGroupTitles',
        
        'ActiveCallWarningColor',
        'ActiveCallLimitColor',
        'HoldTimeWarningColor',
        'HoldTimeLimitColor',
        
        'DashboardLogo',
    ],
    'Fonts': [
        'ShowWidgetTitles',
        'FontSize',
        'WidgetTitlesFontSize',
        'WidgetGroupTitlesFontSize',
    ],
    'Timers': [
        'MinRefreshInterval',
        'RefreshRealTimeDataDelay',
        'ReportInterval',
        'ReportSwitching',
        'ReportRefresh',
        
        'ActiveCallWarning',
        'ActiveCallLimit',
        'HoldTimeWarning',
        'HoldTimeLimit',
    ],
}

export const DEFAULT_LOGO = '/img/navbar/logo.png'
