export const widgets = [
    {
        "ID": "2",
        "WidgetType": {
            "ID": "1", //card
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

export const charts = [
    {
        "ID": "8",
        "WidgetType": {
            "ID": "2",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 7,
        },
        "WidgetConfig": {
            "title": {
                "text": "Minutes comparison between users"
            },
            "xAxis": {
                "type": "datetime"
            },
            "series": [
                {
                    "name": "test1 1",
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 1
                        },
                        {
                            "x": 1564168362000,
                            "y": 0
                        },
                        {
                            "x": 1564308352000,
                            "y": 0
                        }
                    ]
                }
            ],
            "YxisName": "Minutes",
            "date": "06/29/2019 - 07/29/2019"
        }
    },

    //TODO: wait for API response to check another obj.str
    {
        "WidgetType": {
            "ID": "2", //chart
        },
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

export const tables = [
    {
        "ID": "9",
        "WidgetType": {
            "ID": "3",
        },
        "WidgetEntity": {},
        "WidgetLayout": {
            "Order": 8,
        },
        "WidgetConfig": {
            "tableData": [
                {
                    id: 1,
                    img: 'img/tania.jpg',
                    name: 'Tania Mike',
                    job: 'Develop',
                    progress: 25,
                    since: 2013,
                    salary: '€ 99,225'
                },
                {
                    id: 2,
                    img: 'img/robi.jpg',
                    name: 'John Doe',
                    job: 'CEO',
                    progress: 77,
                    since: 2012,
                    salary: '€ 89,241'
                },
                {
                    id: 3,
                    img: 'img/lora.jpg',
                    name: 'Alexa Mike',
                    job: 'Design',
                    progress: 41,
                    since: 2010,
                    salary: '€ 92,144'
                },
                {
                    id: 4,
                    img: 'img/jana.jpg',
                    name: 'Jana Monday',
                    job: 'Marketing',
                    progress: 50,
                    since: 2013,
                    salary: '€ 49,990'
                },
                {
                    id: 5,
                    img: 'img/mike.jpg',
                    name: 'Paul Dickens',
                    job: 'Develop',
                    progress: 100,
                    since: 2015,
                    salary: '€ 69,201'
                },
                {
                    id: 6,
                    img: 'img/emilyz.jpg',
                    name: 'Manuela Rico',
                    job: 'Manager',
                    progress: 15,
                    since: 2012,
                    salary: '€ 99,201'
                }
            ],
            "columns":
                [
                    {
                        prop: 'name',
                        fixed: false,
                        label: 'Name',
                    },
                    {
                        prop: 'job',
                        fixed: false,
                        label: 'Job',
                    },
                    {
                        prop: 'progress',
                        fixed: false,
                        label: 'Progress',
                    },
                    {
                        prop: 'since',
                        fixed: false,
                        label: 'Since',
                        sortable: true
                    },
                    {
                        prop: 'salary',
                        fixed: false,
                        label: 'Salary',
                    }
                ]
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
                "WidgetList": [...widgets, charts[0], tables[0]]
            }
        ]
    }
}

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
