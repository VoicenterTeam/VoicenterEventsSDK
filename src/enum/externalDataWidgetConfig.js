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
    [`${types.COUNTER}`]: 'The response must be a value (a html page)',
    [`${types.SPEEDOMETER}`]: "<a href='https://www.highcharts.com/demo/gauge-solid' target='_blank'>Click to see the documentation</a>",
    [`${types.TABLE}`]: 'The response must be an array of objects: [{key: value...},{...}]',
    [`${types.LINES}`]: "<a href='https://www.highcharts.com/demo/line-basic' target='_blank'>Click to see the documentation</a>",
    [`${types.PIE}`]: "<a href='https://www.highcharts.com/demo/pie-legend' target='_blank'>Click to see the documentation</a>",
};
