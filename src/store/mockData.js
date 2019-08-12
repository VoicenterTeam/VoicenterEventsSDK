export const widgets = [
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
            "icon": "IconStats",
            "caption": "Calls per minute chart",
            "Order": 1,
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
        "WidgetID": "10",
        "TemplateID": "4",
        "WidgetTime": {},
        "WidgetLayout": {
            "Order": 2,
            "icon": "IconIncomingCall",
            "caption": "Realtime call cards",
        },
        "WidgetConfig": [

        ],
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
            "Order": 2,
            "icon": "IconUsers",
            "caption": "Realtime table",
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
            "columns": [
                    {
                        "prop": "name",
                        "fixed": false,
                        "label": "Name"
                    },
                    {
                        "prop": "job",
                        "fixed": false,
                        "label": "Job"
                    },
                    {
                        "prop": "progress",
                        "fixed": false,
                        "label": "Progress"
                    },
                    {
                        "prop": "since",
                        "fixed": false,
                        "label": "Since"
                    },
                    {
                        "prop": "salary",
                        "fixed": false,
                        "label": "Salary"
                    }
                ]
        }
    },
    {
        "Title": "Calls Per Hour",
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
    }, {

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
    }, {
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

export const dashboards = {
    "dashboard1": {
        "ID": 1,
        "Title": "dashboards.main",
        "WidgetGroupList": [
            {
                "ID": 23,
                "Title": "Queue Dashboard",
                "WidgetList": [tables[0]]
            }
        ]
    },
    "dashboard2": {
        "ID": 2,
        "Title": "dashboards.queue",
        "WidgetGroupList": [
            {
                "ID": 23,
                "Title": "General statistics",
                "WidgetList": [charts[0]]
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
        primary: "#2575FF",
        secondary: "#876cff"
    }
}
