import widgetDataTypes from './widgetDataTypes'
import i18n from '@/i18n'

export const types = {
    COUNTER: widgetDataTypes.INFO_TYPE_ID,
    SPEEDOMETER: widgetDataTypes.CHART_SPEEDOMETER,
    TABLE: widgetDataTypes.TABLE_TYPE_ID,
    LINES: widgetDataTypes.LINES_TYPE_ID,
    PIE: widgetDataTypes.PIE_TYPE_ID
};

export const options = [
    {
        label: i18n.t('Counter'),
        value: types.COUNTER
    },
    {
        label: i18n.t('Speedometer'),
        value: types.SPEEDOMETER
    },
    {
        label: i18n.t('Table'),
        value: types.TABLE
    },
    {
        label: i18n.t('Lines'),
        value: types.LINES
    },
    {
        label: i18n.t('Pie'),
        value: types.PIE
    },
];

export const dictionary = {
    [`${types.COUNTER}`]: 'COUNTER: The rules for valid data structure.',
    [`${types.SPEEDOMETER}`]: 'SPEEDOMETER: The rules for valid data structure.',
    [`${types.TABLE}`]: 'TABLE: The rules for valid data structure.',
    [`${types.LINES}`]: 'LINES: The rules for valid data structure.',
    [`${types.PIE}`]: 'PIE: The rules for valid data structure.'
};
