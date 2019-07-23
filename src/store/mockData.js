export const widgets = [
    {
        "ID": "2",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 1,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconPhone",
            "title": "26",
            "description": "widgets.phoneNumbers.description"
        }
    },
    {
        "ID": "3",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 2,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconUsers",
            "title": "15",
            "description": "widgets.users.description"
        }
    },
    {
        "ID": "4",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 3,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconExtensions",
            "title": "38",
            "description": "widgets.extensions.description"
        }
    },
    {
        "ID": "5",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 4,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconStats",
            "title": "514",
            "description": "widgets.stats.description"
        },
    },
    {
        "ID": "6",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 5,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconUsers",
            "title": "87",
            "description": "widgets.users.description"
        }
    },
    {
        "ID": "7",
        "WidgetType": {
            "ID": "1",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 6,
        },
        "WidgetTime": {
            "TimeType": "1",
            "RelativeTimeData": {}
        },
        "WidgetConfig": {
            "icon": "IconExtensions",
            "title": "15",
            "description": "widgets.users.description"
        }
    }
]

export const dashboards = {
    "dashboard1": {
        "ID": 1,
        "Title": "dashboards.main",
        "WidgetGroupList": [
            {
                "ID": 23,
                "Title": "General statistics",
                "WidgetList": [widgets[0], widgets[1], widgets[2], widgets[3]]
            },
            {
                "ID": 24,
                "Title": "General statistics 2",
                "WidgetList": [widgets[1], widgets[2], widgets[0]]
            }
        ]
    },
    "dashboard2": {
        "ID": 2,
        "Title": "Queue Dashboard",
        "WidgetGroupList": [
            {
                "ID": 23,
                "Title": "Queue Dashboard",
                "WidgetList": [...widgets]
            }
        ]
    }
}

export const charts = [
    {
        "chart": {
            "zoomType": "xy"
        },
        "title": {
            "text": "Number of calls vs. minutes"
        },
        "xAxis": [
            {
                "categories": [
                    "test1 fstouch"
                ]
            }
        ],
        "yAxis": [
            {
                "title": {
                    "text": "Calls",
                    "style": {
                        "color": "#49ca6d"
                    }
                },
                "opposite": "true"
            },
            {
                "title": {
                    "text": "Minutes",
                    "style": {
                        "color": "#61b5ff"
                    }
                },
                "opposite": null
            }
        ],
        "series": [
            {
                "name": "Minutes",
                "color": "#61b5ff",
                "type": "column",
                "yAxis": 1,
                "data": [
                    5
                ]
            },
            {
                "name": "Calls",
                "color": "#49ca6d",
                "type": "spline",
                "yAxis": 0,
                "data": [
                    10
                ]
            }
        ],
        "date": "08/07/2019 - 15/07/2019"
    },

    //TODO: wait for API response to check another obj.str
    {
        "ID": 2,
        "Title": "Simple Gantt Chart",
        "Type": 'gantt',
        "Series": [{
            "data": [{
                "id": 's',
                "name": 'Start prototype',
                "start": Date.UTC(2019, 5, 18),
                "end": Date.UTC(2019, 5, 20),
                "dependency": [],
                "color": 'red',
            }, {
                "id": 'b',
                "name": 'Develop',
                "start": Date.UTC(2019, 5, 20),
                "end": Date.UTC(2019, 5, 25),
                "dependency": ['s'],
                "color": 'green',
            }, {
                "id": 'a',
                "name": 'Run acceptance tests',
                "start": Date.UTC(2019, 5, 23),
                "end": Date.UTC(2019, 5, 26),
                "dependency": [],
                "color": 'blue',
            }, {
                "id": 'c',
                "name": 'Test prototype',
                "start": Date.UTC(2019, 5, 27),
                "end": Date.UTC(2019, 6, 29),
                "dependency": ['a', 'b'],
                "color": 'yellow',
            }]
        }],
    },
]

export const settings = {
    report: {
        interval: 3,
        switching: true,
        refresh: false
    },
    colors: {
        primary: '#2575FF',
        secondary: '#876cff'
    }
}
