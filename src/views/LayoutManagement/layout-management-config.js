import i18n from "@/i18n";

export const globalAccountSettings = {
    "LayoutID": "1",
    "LayoutAccountID": "0"
};

export const ACCOUNT_LAYOUTS_KEY = 'accountLayouts';

export const availableLayouts = [{
    label: i18n.t('Account Layouts'),
    name: 'accountLayouts',
    key: 'accountLayouts',
    data: 'accountLayouts',
}, {
    label: i18n.t('Default Layouts'),
    name: 'globalLayouts',
    key: 'globalLayouts',
    data: 'globalLayouts',
}];

export const sliderOptionConfigs = {
    FontSize: {
        min: 8,
        max: 24,
        step: 1,
        marks: {
            14: '14px',
            16: '16px',
            20: '20px'
        },
    },
    WidgetTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1,
        marks: {
            16: '16px',
            22: '22px',
            26: '26px',
            32: '32px',
        },
    },
    WidgetGroupTitlesFontSize: {
        min: 12,
        max: 48,
        step: 1,
        marks: {
            16: '16px',
            22: '22px',
            26: '26px',
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
        }
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
            60: '60min',
        }
    },
    ReportInterval: {
        min: 10,
        max: 1000,
        step: 10,
        marks: {
            100: '100s',
            200: '200s',
            400: '400s',
            600: '600s',
            800: '800s',
        }
    },
};

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
];
