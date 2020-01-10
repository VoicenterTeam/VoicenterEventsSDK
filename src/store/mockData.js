export const widgets = [
    {
        "Title": "Calls Per Minute",
        "WidgetID": "162",
        "TemplateID": "1",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "icon": "IconStats",
            "caption": "Calls per minute chart",
            "Order": 2,
            "title": {
                "text": ""
            },
            "xAxis": {
                "type": "datetime",
                "lineColor": ""
            },
            "series": [
                {
                    "name": "Outgoing",
                    "color": "#2675ff",
                    "type": "spline",
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 1
                        },
                        {
                            "x": 1564168362000,
                            "y": 2
                        },
                        {
                            "x": 1564308352000,
                            "y": 3
                        }
                    ],
                    "shadow": {
                        "offsetY": 15,
                        "opacity": 0.005,
                        "width": 20
                    }
                }, {
                    "name": "Incoming",
                    "color": "#876cff",
                    "type": "spline",
                    "dashStyle": "shortdot",
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 2.25
                        },
                        {
                            "x": 1564168362000,
                            "y": 1.5
                        },
                        {
                            "x": 1564308352000,
                            "y": 4
                        }
                    ]
                }
            ],
            "legend": {
                "enabled": true,
                "align": "center",
                "verticalAlign": "top",
                "floating": true,
                "y": -7,
                "itemStyle": {
                    "color": "#899398",
                    "fontFamily": "Montserrat",
                    "fontSize": "16px"
                }
            },
            "yAxis": [{
                "opposite": false,
                "title": false,
                "labels": {
                    "style": {
                        "color": "#bfc5d0",
                        "fontSize": "16px"
                    }
                }
            }],
            "tooltip": {
                "formatter": function () {
                    return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                },
                "backgroundColor": "#ffffff",
                "borderColor": "#ffffff",
                "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                "borderRadius": 10
            },
            "date": "06/29/2019 - 07/29/2019"
        }
    },
    {
        "Title": "Realtime call cards",
        "WidgetID": "330",
        "TemplateID": "5",
        "WidgetTime": {},
        "WidgetLayout": {
            "Order": 1,
            "icon": "IconIncomingCall",
            "caption": "Realtime call cards",
        },
        "WidgetConfig": [],
        "WidgetEntity": [
            {
                "EntityID": 9,
                "EntityType": 2
            }
        ]
    },
    {
        "Title": "Table",
        "WidgetID": "8",
        "TemplateID": "4",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "Order": 2,
            "icon": "IconUsers",
            "caption": "Realtime table",
            "columns": [
                {
                    "prop": "name",
                    "align": "left",
                    "fixed": false,
                    "label": "Name"
                },
                {
                    "prop": "job",
                    "align": "left",
                    "fixed": false,
                    "label": "Job"
                },
                {
                    "prop": "progress",
                    "align": "center",
                    "fixed": false,
                    "label": "Progress"
                },
                {
                    "prop": "since",
                    "align": "center",
                    "fixed": false,
                    "label": "Since"
                },
                {
                    "prop": "salary",
                    "align": "center",
                    "fixed": false,
                    "label": "Salary"
                }
            ],
            "tableData": [
                {
                    "id": 1,
                    "img": "img/tania.jpg",
                    "job": "Develop",
                    "name": "Tania Mike",
                    "since": 2013,
                    "salary": "€ 99,225",
                    "progress": 25
                },
                {
                    "id": 2,
                    "img": "img/robi.jpg",
                    "job": "CEO",
                    "name": "John Doe",
                    "since": 2012,
                    "salary": "€ 89,241",
                    "progress": 77
                },
                {
                    "id": 3,
                    "img": "img/lora.jpg",
                    "job": "Design",
                    "name": "Alexa Mike",
                    "since": 2010,
                    "salary": "€ 92,144",
                    "progress": 41
                },
                {
                    "id": 4,
                    "img": "img/jana.jpg",
                    "job": "Marketing",
                    "name": "Jana Monday",
                    "since": 2013,
                    "salary": "€ 49,990",
                    "progress": 50
                },
                {
                    "id": 5,
                    "img": "img/mike.jpg",
                    "job": "Develop",
                    "name": "Paul Dickens",
                    "since": 2015,
                    "salary": "€ 69,201",
                    "progress": 100
                },
                {
                    "id": 6,
                    "img": "img/emilyz.jpg",
                    "job": "Manager",
                    "name": "Manuela Rico",
                    "since": 2012,
                    "salary": "€ 99,201",
                    "progress": 15
                }
            ]
        },
        "WidgetColumns": [
            {
                "WidgetID": 160,
                "ColumnName": "",
                "ColumnIndex": 0,
                "TemplateColumnID": 20,
                "WidgetColumnConfig": {}
            }
        ]
    },
    {
        "Title": "Calls Per Hour",
        "WidgetID": "323",
        "TemplateID": "2",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "Order": 3,
            "caption": "Calls per hour chart",
            "icon": "IconStats",
            "chart": {
                "type": "column"
            },
            "title": {
                "text": ""
            },
            "xAxis": {
                "type": "datetime",
            },
            "series": [
                {
                    "pointWidth": 20,
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 3
                        },
                        {
                            "x": 1564168362000,
                            "y": 2,
                            "color": "#d6dae1"
                        },
                        {
                            "x": 1564308352000,
                            "y": 1.6,
                            "color": "green"
                        }
                    ]
                }
            ],
            "date": "06/29/2019 - 07/29/2019"
        }
    },

    {
        "Title": "Statistics cards",
        "WidgetID": "223",
        "TemplateID": "55",
        "WidgetTime": {},
        "WidgetLayout": {
            "Order": 1,
            "icon": "IconIncomingCall",
            "caption": "Statistics cards",
            "status": 1
        },
        "WidgetConfig": [],
        "WidgetEntity": [
            {
                "EntityID": 9,
                "EntityType": 2
            }
        ]
    },
    {
        "Title": "Status cards",
        "WidgetID": "228",
        "TemplateID": "66",
        "WidgetTime": {},
        "WidgetConfig": [],
        "WidgetEntity": [
            {
                "EntityID": 9,
                "EntityType": 2
            }
        ],
        "WidgetLayout": {
            "icon": "IconLogin",
            "Order": 1,
            "status": 9,
            "caption": "Status cards"
        }
    },
]

export const charts = [
    {

        "Title": "Calls Per Hours",
        "WidgetID": "7",
        "TemplateID": "2",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "Order": 6,
            "chart": {
                "type": "column",
                "marginTop": 45
            },
            "title": {
                "text": ""
            },
            "xAxis": {
                "type": "datetime",
            },
            "series": [
                {
                    "pointWidth": 20,
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 3
                        },
                        {
                            "x": 1564168362000,
                            "y": 2,
                            "color": "#d6dae1"
                        },
                        {
                            "x": 1564308352000,
                            "y": 1.6,
                            "color": "green"
                        }
                    ]
                }
            ],
            "tooltip": {
                "formatter": function () {
                    return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                },
                "backgroundColor": "#ffffff",
                "borderColor": "#ffffff",
                "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                "borderRadius": 10,
            },
            "date": "05/29/2019 - 07/20/2019"
        }
    },
    {

        "Title": "Calls Per Minute",
        "WidgetID": "9",
        "TemplateID": "2",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "Order": 8,
            "title": {
                "text": ""
            },
            "xAxis": {
                "type": "datetime",
                "lineColor": ""
            },
            "series": [
                {
                    "name": "Outgoing",
                    "color": "#2675ff",
                    "type": "spline",
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 1
                        },
                        {
                            "x": 1564168362000,
                            "y": 2,
                        },
                        {
                            "x": 1564308352000,
                            "y": 3,
                        }
                    ],
                    "shadow": {
                        "offsetY": 15,
                        "opacity": 0.004,
                        "width": 20
                    }
                }, {
                    "name": "Incoming",
                    "color": "#876cff",
                    "type": "spline",
                    "dashStyle": "shortdot",
                    "data": [
                        {
                            "x": 1563441556000,
                            "y": 2.25
                        },
                        {
                            "x": 1564168362000,
                            "y": 1.5,
                        },
                        {
                            "x": 1564308352000,
                            "y": 4,
                        }
                    ]
                }
            ],
            "legend": {
                "enabled": true,
                "align": "center",
                "verticalAlign": "top",
                "floating": true,
                "y": -15,
                "itemStyle": {
                    "color": "#899398",
                    "fontFamily": "Montserrat",
                    "fontWeight": 500,
                    "fontSize": "15px"
                },
            },
            "yAxis": [{
                "opposite": false,
                "title": false,
                "labels": {
                    "style": {
                        "color": "#bfc5d0",
                        "fontSize": "16px"
                    }
                },
            }],
            "tooltip": {
                "formatter": function () {
                    return `<p style="font-size: 16px; color: ${this.point.color}; margin-top: 10px">${this.point.y}</p>`
                },
                "backgroundColor": "#ffffff",
                "borderColor": "#ffffff",
                "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                "borderRadius": 10,
            },
            "date": "06/29/2019 - 07/29/2019"
        }
    },
    {
        "WidgetType": {
            "ID": "2", //chart
        },
        "ID": 2,
        "Title": "Simple Gantt Chart",
        "Type": "gantt",
        "Series": [{
            "data": [{
                "id": "s",
                "name": "Start prototype",
                "start": Date.UTC(2019, 5, 18),
                "end": Date.UTC(2019, 5, 20),
                "dependency": [],
                "color": "red",
            }, {
                "id": "b",
                "name": "Develop",
                "start": Date.UTC(2019, 5, 20),
                "end": Date.UTC(2019, 5, 25),
                "dependency": ["s"],
                "color": "green",
            }, {
                "id": "a",
                "name": "Run acceptance tests",
                "start": Date.UTC(2019, 5, 23),
                "end": Date.UTC(2019, 5, 26),
                "dependency": [],
                "color": "blue",
            }, {
                "id": "c",
                "name": "Test prototype",
                "start": Date.UTC(2019, 5, 27),
                "end": Date.UTC(2019, 6, 29),
                "dependency": ["a", "b"],
                "color": "yellow",
            }]
        }],
    },
]

export const tables = [
    {
        "Title": "1",
        "WidgetID": "8",
        "TemplateID": "3",
        "WidgetTime": {},
        "WidgetConfig": [
            {
                "Key": "Foo",
                "ParameterID": 1
            }
        ],
        "WidgetEntity": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "WidgetLayout": {
            "Caption": "Users Table",
            "Order": 7,
            "tableData": [
                {
                    id: 1,
                    img: "img/tania.jpg",
                    name: "Tania Mike",
                    job: "Develop",
                    progress: 25,
                    since: 2013,
                    salary: "€ 99,225"
                },
                {
                    id: 2,
                    img: "img/robi.jpg",
                    name: "John Doe",
                    job: "CEO",
                    progress: 77,
                    since: 2012,
                    salary: "€ 89,241"
                },
                {
                    id: 3,
                    img: "img/lora.jpg",
                    name: "Alexa Mike",
                    job: "Design",
                    progress: 41,
                    since: 2010,
                    salary: "€ 92,144"
                },
                {
                    id: 4,
                    img: "img/jana.jpg",
                    name: "Jana Monday",
                    job: "Marketing",
                    progress: 50,
                    since: 2013,
                    salary: "€ 49,990"
                },
                {
                    id: 5,
                    img: "img/mike.jpg",
                    name: "Paul Dickens",
                    job: "Develop",
                    progress: 100,
                    since: 2015,
                    salary: "€ 69,201"
                },
                {
                    id: 6,
                    img: "img/emilyz.jpg",
                    name: "Manuela Rico",
                    job: "Manager",
                    progress: 15,
                    since: 2012,
                    salary: "€ 99,201"
                }
            ],
            "columns":
                [
                    {
                        prop: "name",
                        fixed: false,
                        label: "Name",
                        align: "left"
                    },
                    {
                        prop: "job",
                        fixed: false,
                        label: "Job",
                        align: "left"
                    },
                    {
                        prop: "progress",
                        fixed: false,
                        label: "Progress",
                        align: "center"
                    },
                    {
                        prop: "since",
                        fixed: false,
                        label: "Since",
                        align: "center"
                    },
                    {
                        prop: "salary",
                        fixed: false,
                        label: "Salary",
                        align: "center"
                    }
                ]
        }
    }
]

export const dashboards = [
    {
        "AccountID": 1,
        "DashboardID": 143,
        "DashboardTitle": "dashboards.main",
        "DashboardLayout": {
            "settings": {
                "colors": {
                    "primary": "#E6761A",
                    "secondary": "#876cff",
                    "primary_rgba": "37, 117, 255"
                },
                "report": {
                    "refresh": false,
                    "interval": 5,
                    "switching": true
                },
            }
        },
        "WidgetGroupList": [
            {
                "WidgetList": [
                    {
                        "Title": "Realtime call cards",
                        "WidgetID": "312",
                        "TemplateID": 5,
                        "WidgetTime": {},
                        "WidgetConfig": [
                            {
                                "ParameterID": 0,
                                "WidgetParameterValue": ""
                            }
                        ],
                        "WidgetEntity": [
                            {
                                "EntityID": 9,
                                "EntityType": 2
                            }
                        ],
                        "WidgetLayout": {
                            "icon": "IconIncomingCall",
                            "Order": 1,
                            "caption": "Realtime call cards"
                        },
                        "WidgetColumns": [
                            {
                                "WidgetID": 312,
                                "ColumnName": "",
                                "ColumnIndex": 0,
                                "TemplateColumnID": 160,
                                "WidgetColumnConfig": {}
                            }
                        ]
                    }
                ],
                "WidgetGroupID": "184",
                "WidgetGroupTitle": "Gr 1 - 1"
            },
        ],
        "DashBoardsPermission": [
            {
                "EntityID": 8,
                "EntityType": 1
            }
        ],
        "GroupTransitionTimer": 1,
        "DashBoardsUserPermission": "foo"
    }
]

export const gaugeCharts = [{
    title: {
        text: 'Requests Per Second',
        y: 70
    },
    yAxis: {
        min: 0,
        max: 100,
    },
    series: [{
        data: [80],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:22px">RPS</span><br/><br/>' +
                '<span style="font-size:20px;opacity:0.4;">{y}</span>' +
                '</div>',
            y: -65
        }
    }]
}, {
    title: {
        text: 'Bandwidth Per Second',
        y: 70
    },
    yAxis: {
        min: 0,
        max: 100,
    },
    series: [{
        data: [10],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:22px">kb/s</span><br/><br/>' +
                '<span style="font-size:20px;opacity:0.4;">{y:.1f}</span>' +
                '</div>',
            y: -65
        }
    }]
}, {
    title: {
        text: 'Cache Hit Percentage',
        y: 70
    },
    yAxis: {
        min: 0,
        max: 100,
    },
    series: [{
        data: [55],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:22px">Cache Hit %</span><br/><br/>' +
                '<span style="font-size:20px;opacity:0.4;">{y:.1f} %</span>' +
                '</div>',
            y: -65
        },
    }]
}]

// FOR TEST
export const queueExample = [
    {
        "QueueID": 10031,
        "Calls": [
            {
                "CallerID": "0532559065",
                "CallerName": "VC Support",
                "IvrUniqueID": "202001081642500136917c76ded7ddd4",
                "JoinTimeStamp": 1578501818,
                "calldurationinterval": 1578501818,
                "ivrid": "202001081642500136917c76ded7ddd4"
            },
            {
                "CallerID": "0528711001",
                "CallerName": "VC Customer Service",
                "IvrUniqueID": "2020010816424301361a549c3c50e7b1",
                "JoinTimeStamp": 1578501824,
                "calldurationinterval": 1578501824,
                "ivrid": "2020010816424301361a549c3c50e7b1"
            }
        ],
        "QueueName": "VC Support"
    }
]

// FOR TEST
export const eventTypes = {
    HANGUP: {
        "name": "ExtensionEvent",
        "data": {
            "data": {
                "calls": [],
                "userID": 108510,
                "userName": "Cristi Jora",
                "number": 71793,
                "extenUser": "WPGrStO1",
                "summery": {
                    "representative": "Cristi Jora"
                },
                "onlineUserID": 108510,
                "representative": 108510,
                "representativeStatus": 7,
                "lastCallEventEpoch": 1578671207,
                "lastAnsweredCallEventEpoch": 1578671207,
                "lastHangupCallEpoch": 1578671207,
                "representativeUpdated": 1578668094000
            },
            "eventName": "extension",
            "reason": "HANGUP",
            "servertime": 1578671207,
            "callerID": "40376300329",
            "ivruniqueid": "202001101546330136qsdc3evdjfirh1",
            "dialStatus": "",
            "cause": "Normal hangup"
        }
    },
    NEWCALL: {
        "name": "ExtensionEvent",
        "data": {
            "data": {
                "calls": [
                    {
                        "callStarted": 1578671193,
                        "calldurationinterval": 1578671193,
                        "callAnswered": 0,
                        "answered": 0,
                        "callername": "40376300329",
                        "callerphone": "40376300329",
                        "callstatus": "Dialing",
                        "customdata": {},
                        "direction": "Click2Call",
                        "ivrid": "202001101546330136qsdc3evdjfirh1",
                        "recording": {
                            "Filename": "202001101546330136qsdc3evdjfirh1-aws-WPGrStO1-40376300329.wav",
                            "Options": "",
                            "ApproximateURL": "",
                            "IsMuted": 0
                        },
                        "did": "",
                        "c2cdirection": 1,
                        "channel": "SIP/WPGrStO1-00000186",
                        "channel2": "Local/0500000000@dialer_dummy-00000144;1"
                    }
                ],
                "userID": 108510,
                "userName": "Cristi Jora",
                "number": 71793,
                "extenUser": "WPGrStO1",
                "summery": {
                    "representative": "Cristi Jora"
                },
                "onlineUserID": 108510,
                "representative": 108510,
                "representativeStatus": 7,
                "lastCallEventEpoch": 1578671193,
                "lastAnsweredCallEventEpoch": 1578671124,
                "lastHangupCallEpoch": 1578671124,
                "representativeUpdated": 1578668094000
            },
            "eventName": "extension",
            "reason": "NEWCALL",
            "servertime": 1578671193
        }
    }
}

// 106576
