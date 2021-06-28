import widgetDataTypes from './widgetDataTypes'
import i18n from '@/i18n'

export const types = {
    COUNTER: widgetDataTypes.INFO_TYPE_ID,
    SPEEDOMETER: widgetDataTypes.CHART_SPEEDOMETER,
    TABLE: widgetDataTypes.TABLE_TYPE_ID,
    LINES: widgetDataTypes.LINES_TYPE_ID,
    PIE: widgetDataTypes.PIE_TYPE_ID,
    FUNNEL: widgetDataTypes.FUNNEL_3D_TYPE_ID,
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
    {
        label: i18n.t('3D Funnel'),
        value: types.FUNNEL
    },
];

export const dictionary = {
    [types.COUNTER]: 'Some html',
    [types.SPEEDOMETER]: {
        Data: [
            {
                name: "s 1",
                data: [
                    1,
                    2
                ]
            },
            {
                name: "s 2",
                data: [
                    4,
                    3
                ]
            }
        ]
    },
    [types.TABLE]: {
        Data: [
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            },
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            },
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            },
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            },
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            },
            {
                row_1: 1,
                row_2: 2,
                row_3: 3,
                row_4: 4,
                row_5: 5,
                row_6: 6
            }
        ]
    },
    [types.LINES]: {
        Data: [
            {
                name: "Installation",
                data: [
                    43934,
                    52503,
                    57177,
                    69658,
                    97031,
                    119931,
                    137133,
                    154175
                ]
            },
            {
                name: "Manufacturing",
                data: [
                    24916,
                    24064,
                    29742,
                    29851,
                    32490,
                    30282,
                    38121,
                    40434
                ]
            },
            {
                name: "Sales& Distribution",
                data: [
                    11744,
                    17722,
                    16005,
                    19771,
                    20185,
                    24377,
                    32147,
                    39387
                ]
            },
            {
                name: "Project Development",
                data: [
                    null,
                    null,
                    7988,
                    12169,
                    15112,
                    22452,
                    34400,
                    34227
                ]
            },
            {
                name: "Other",
                data: [
                    12908,
                    5948,
                    8105,
                    11248,
                    8989,
                    11816,
                    18274,
                    18111
                ]
            }
        ]
    },
    [types.PIE]: {
        Data: [
            {
                color: "#5EB300",
                name: "name 1",
                y: 3
            },
            {
                color: "#48BB78",
                name: "name 2",
                y: 5
            },
            {
                color: "#A0AEC0",
                name: "name 3",
                y: 7
            },
            {
                color: "#61B5FF",
                name: "name 4",
                y: 1
            }
        ]
    },
    [types.FUNNEL]: {
        Data:[
            {
                name: 'Unique users',
                data: [
                    ['Website visits', 15654],
                    ['Downloads', 4064],
                    ['Requested price list', 1987],
                    ['Invoice sent', 976],
                    ['Finalized', 846],
                ],
            },
        ]
    }
};
