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

export const optionConfigs = {
    FontSize: {
        min: 8,
        max: 24,
        step: 1
    },
    WidgetTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1
    },
    WidgetGroupTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1
    },
    WidgetTableContentFontSize: {
        min: 12,
        max: 48,
        step: 1
    },
    MinRefreshInterval: {
        min: 10,
        max: 1000,
        step: 15
    },
    RefreshRealTimeDataDelay: {
        min: 3,
        max: 90,
        step: 15
    },
    ReportInterval: {
        min: 10,
        max: 1000,
        step: 15
    },
    ActiveCallWarning: {
        min: 1,
        max: 7200,
        step: 15
    },
    ActiveCallLimit: {
        min: 1,
        max: 7200,
        step: 15
    },
    HoldTimeWarning: {
        min: 1,
        max: 7200,
        step: 15
    },
    HoldTimeLimit: {
        min: 1,
        max: 7200,
        step: 15
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
        'LoginStatusWarningColor',
        'LoginStatusLimitColor',

        'InCallColor',
        'OnHoldColor',

        'DashboardLogo',
    ],
    'Fonts': [
        'ShowWidgetTitles',
        'FontSize',
        'WidgetTitlesFontSize',
        'WidgetGroupTitlesFontSize',
        'WidgetTableContentFontSize'
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
