export const widgets = [
    {
        "Title": "Calls Per Minute",
        "WidgetID": 1,
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
        "WidgetID": 2,
        "TemplateID": "4",
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
        "Title": "Statistics cards",
        "WidgetID": "111",
        "TemplateID": "5",
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
        "WidgetID": 112,
        "TemplateID": "6",
        "WidgetTime": {},
        "WidgetLayout": {
            "Order": 1,
            "icon": "IconLogin",
            "caption": "Status cards",
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
        "WidgetID": 3,
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
            "additionalProp1": {}
        },
        "WidgetGroupList": [
            {
                "WidgetList": [
                    {
                        "Title": "Realtime call cards",
                        "WidgetID": "312",
                        "TemplateID": 4,
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
                    },
                    // {
                    //     "Title": "",
                    //     "WidgetID": "313",
                    //     "TemplateID": 2,
                    //     "WidgetTime": {},
                    //     "WidgetConfig": [
                    //         {
                    //             "ParameterID": 1,
                    //             "WidgetParameterValue": ""
                    //         }
                    //     ],
                    //     "WidgetEntity": [
                    //         {
                    //             "EntityID": 8,
                    //             "EntityType": 1
                    //         }
                    //     ],
                    //     "WidgetLayout": {
                    //         "date": "06/29/2019 - 07/29/2019",
                    //         "icon": "IconStats",
                    //         "Order": 2,
                    //         "title": {
                    //             "text": ""
                    //         },
                    //         "xAxis": {
                    //             "type": "datetime",
                    //             "lineColor": ""
                    //         },
                    //         "yAxis": [
                    //             {
                    //                 "title": false,
                    //                 "labels": {
                    //                     "style": {
                    //                         "color": "#bfc5d0",
                    //                         "fontSize": "16px"
                    //                     }
                    //                 },
                    //                 "opposite": false
                    //             }
                    //         ],
                    //         "legend": {
                    //             "y": -7,
                    //             "align": "center",
                    //             "enabled": true,
                    //             "floating": true,
                    //             "itemStyle": {
                    //                 "color": "#899398",
                    //                 "fontSize": "16px",
                    //                 "fontFamily": "Montserrat"
                    //             },
                    //             "verticalAlign": "top"
                    //         },
                    //         "series": [
                    //             {
                    //                 "data": [
                    //                     {
                    //                         "x": 1563441556000,
                    //                         "y": 1
                    //                     },
                    //                     {
                    //                         "x": 1564168362000,
                    //                         "y": 2
                    //                     },
                    //                     {
                    //                         "x": 1564308352000,
                    //                         "y": 3
                    //                     }
                    //                 ],
                    //                 "name": "Outgoing",
                    //                 "type": "spline",
                    //                 "color": "#2675ff",
                    //                 "shadow": {
                    //                     "width": 20,
                    //                     "offsetY": 15,
                    //                     "opacity": 0.005
                    //                 }
                    //             },
                    //             {
                    //                 "data": [
                    //                     {
                    //                         "x": 1563441556000,
                    //                         "y": 2.25
                    //                     },
                    //                     {
                    //                         "x": 1564168362000,
                    //                         "y": 1.5
                    //                     },
                    //                     {
                    //                         "x": 1564308352000,
                    //                         "y": 4
                    //                     }
                    //                 ],
                    //                 "name": "Incoming",
                    //                 "type": "spline",
                    //                 "color": "#876cff",
                    //                 "dashStyle": "shortdot"
                    //             }
                    //         ],
                    //         "caption": "Calls per minute chart",
                    //         "tooltip": {
                    //             "boxShadow": "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
                    //             "borderColor": "#ffffff",
                    //             "borderRadius": 10,
                    //             "backgroundColor": "#ffffff"
                    //         }
                    //     },
                    //     "WidgetColumns": [
                    //         {
                    //             "WidgetID": 313,
                    //             "ColumnName": "",
                    //
                    {
                        "Title": "Table",
                        "WidgetID": "203",
                        "TemplateID": 3,
                        "WidgetTime": {},
                        "WidgetConfig": [
                            {
                                "ParameterID": 1,
                                "WidgetParameterValue": ""
                            }
                        ],
                        "WidgetEntity": [
                            {
                                "EntityID": 8,
                                "EntityType": 1
                            }
                        ],
                        "WidgetLayout": {
                            "icon": "IconUsers",
                            "Order": 2,
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
                                    "prop": "status",
                                    "align": "left",
                                    "fixed": false,
                                    "label": "Status"
                                },
                                {
                                    "prop": "status_duration",
                                    "align": "left",
                                    "fixed": false,
                                    "label": "Current status duration",
                                    "width": "250px"
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
                                    "user_id": 106576,
                                    "img": "img/tania.jpg",
                                    "job": "Develop",
                                    "status": "logged Off",
                                    "status_duration": "",
                                    "name": "Tania Mike",
                                    "since": 2013,
                                    "salary": "€ 99,225",
                                    "progress": 25
                                },
                                {
                                    "user_id": 43610,
                                    "img": "img/robi.jpg",
                                    "job": "CEO",
                                    "status": "logged Off",
                                    "status_duration": "",
                                    "name": "John Doe",
                                    "since": 2012,
                                    "salary": "€ 89,241",
                                    "progress": 77
                                },
                                {
                                    "user_id": 3,
                                    "img": "img/lora.jpg",
                                    "job": "Design",
                                    "status": "logged Off",
                                    "status_duration": "",
                                    "name": "Alexa Mike",
                                    "since": 2010,
                                    "salary": "€ 92,144",
                                    "progress": 41
                                },
                                {
                                    "user_id": 4,
                                    "img": "img/jana.jpg",
                                    "job": "Marketing",
                                    "status": "logged Off",
                                    "status_duration": "",
                                    "name": "Jana Monday",
                                    "since": 2013,
                                    "salary": "€ 49,990",
                                    "progress": 50
                                },
                                {
                                    "user_id": 5,
                                    "img": "img/mike.jpg",
                                    "job": "Develop",
                                    "name": "Paul Dickens",
                                    "since": 2015,
                                    "salary": "€ 69,201",
                                    "progress": 100
                                },
                                {
                                    "user_id": 6,
                                    "img": "img/emilyz.jpg",
                                    "job": "Manager",
                                    "status": "logged Off",
                                    "status_duration": "",
                                    "name": "Manuela Rico",
                                    "since": 2012,
                                    "salary": "€ 99,201",
                                    "progress": 15
                                }
                            ]
                        },
                        "WidgetColumns": [
                            {
                                "WidgetID": 280,
                                "ColumnName": "",
                                "ColumnIndex": 0,
                                "TemplateColumnID": 131,
                                "WidgetColumnConfig": {}
                            }
                        ]
                    }
                ],
                "WidgetGroupID": "184","ColumnIndex": 0,
                //             "TemplateColumnID": 161,
                //             "WidgetColumnConfig": {}
                //         }
                //     ]
                // },
                "WidgetGroupTitle": ""
            }
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

export const settings = {
    report: {
        interval: 3,
        switching: true,
        refresh: false
    },
    colors: {
        primary: "#2575FF",
        secondary: "#876cff",
        primary_rgba: "37, 117, 255"
    }
}

export const tableData = [{
    "User": "Liav Malka 81",
    "Department": "Product Management",
    "Total calls": 396,
    "Internal calls": 94,
    "Total call duration": "10:53:33",
    "Avg. call duration": "0:02:34",
    "Answered calls": 252,
    "Unanswered calls": 50,
    "Dialing duration": "0:23:12",
    "Outgoing calls": 261,
    "Outgoing duration": "5:57:09",
    "Avg. outgoing duration": "0:01:40",
    "Answered outgoing": 212,
    "Unanswered outgoing": 49,
    "Destinations": 61,
    "Incoming calls": 41,
    "Incoming duration": "4:56:24",
    "Avg. incoming duration": "0:07:24",
    "Answered incoming": 40,
    "Unanswered incoming": 1,
    "Queue Calls": 41,
    "Queue Calls Duration": "4:56:24",
    "Answered Queue Calls": 40,
    "Avg. queue duration": "0:07:24",
    "Xfer calls": 0,
    "Xfer duration": "0:00:00",
    "Avg. Xfer duration": "0:00:00",
    "Shift duration": "145:17:01",
    "Answered per net hour": 22.34,
    "Answered per gross hour": 18.52,
    "Answered per gross hour (IDLE=WORK)": 1.73,
    "Net employment": "8 %",
    "Gross employment (IDLE=WORK)": "98 %",
    "Gross employment (IDLE=WORK,OUT=AutoAdmin)": "98 %",
    "Gross employment": "9 %",
    "Idle duration": "131:40:42",
    "Idle percentage": "90.64 %",
    "Avg. duration between calls": "0:19:57",
    "Lunch breaks": 0,
    "Lunch duration": "0:00:00",
    "Administrative breaks": 1,
    "Administrative duration": "2:19:34",
    "Private breaks": 0,
    "Private duration": "0:00:00",
    "Other breaks": 0,
    "Other duration": "0:00:00",
    "Training breaks": 0,
    "Training duration": "0:00:00",
    "Team Meeting breaks": 0,
    "Team Meeting duration": "0:00:00",
    "Brief breaks": 0,
    "Brief duration": "0:00:00",
    "Total work statuses amount": 0,
    "Total work statuses duration": "0:00:00",
    "Total non-work statuses amount": 1,
    "Total non-work statuses duration": "2:19:34",
    "Hold count": 72,
    "Hold duration": "0:29:37",
    "Hold Percentage": "4.03 %"
}, {
    "User": "Guy Popov",
    "Department": "SupportVC",
    "Total calls": 203,
    "Internal calls": 15,
    "Total call duration": "18:42:50",
    "Avg. call duration": "0:06:38",
    "Answered calls": 169,
    "Unanswered calls": 19,
    "Dialing duration": "0:12:23",
    "Outgoing calls": 91,
    "Outgoing duration": "3:06:58",
    "Avg. outgoing duration": "0:02:35",
    "Answered outgoing": 72,
    "Unanswered outgoing": 19,
    "Destinations": 64,
    "Incoming calls": 97,
    "Incoming duration": "15:35:52",
    "Avg. incoming duration": "0:09:38",
    "Answered incoming": 97,
    "Unanswered incoming": 0,
    "Queue Calls": 94,
    "Queue Calls Duration": "15:26:19",
    "Answered Queue Calls": 94,
    "Avg. queue duration": "0:09:51",
    "Xfer calls": 0,
    "Xfer duration": "0:00:00",
    "Avg. Xfer duration": "0:00:00",
    "Shift duration": "44:27:20",
    "Answered per net hour": 4.18,
    "Answered per gross hour": 3.7,
    "Answered per gross hour (IDLE=WORK)": 3.8,
    "Net employment": "103 %",
    "Gross employment (IDLE=WORK)": "88 %",
    "Gross employment (IDLE=WORK,OUT=AutoAdmin)": "87 %",
    "Gross employment": "91 %",
    "Idle duration": "00:00:00",
    "Idle percentage": "0.00 %",
    "Avg. duration between calls": "0:05:59",
    "Lunch breaks": 8,
    "Lunch duration": "3:41:14",
    "Administrative breaks": 192,
    "Administrative duration": "16:36:41",
    "Private breaks": 17,
    "Private duration": "1:33:44",
    "Other breaks": 0,
    "Other duration": "0:00:00",
    "Training breaks": 15,
    "Training duration": "4:52:48",
    "Team Meeting breaks": 0,
    "Team Meeting duration": "0:00:00",
    "Brief breaks": 0,
    "Brief duration": "0:00:00",
    "Total work statuses amount": 207,
    "Total work statuses duration": "21:29:29",
    "Total non-work statuses amount": 25,
    "Total non-work statuses duration": "5:14:58",
    "Hold count": 102,
    "Hold duration": "4:08:19",
    "Hold Percentage": "20.90 %"
}, {
    "User": "Dudu Ben Moshe",
    "Department": "Technical Tier2",
    "Total calls": 102,
    "Internal calls": 6,
    "Total call duration": "6:08:14",
    "Avg. call duration": "0:05:50",
    "Answered calls": 63,
    "Unanswered calls": 33,
    "Dialing duration": "0:17:15",
    "Outgoing calls": 74,
    "Outgoing duration": "4:24:13",
    "Avg. outgoing duration": "0:06:26",
    "Answered outgoing": 41,
    "Unanswered outgoing": 33,
    "Destinations": 24,
    "Incoming calls": 22,
    "Incoming duration": "1:44:01",
    "Avg. incoming duration": "0:04:43",
    "Answered incoming": 22,
    "Unanswered incoming": 0,
    "Queue Calls": 21,
    "Queue Calls Duration": "1:22:59",
    "Answered Queue Calls": 21,
    "Avg. queue duration": "0:03:57",
    "Xfer calls": 0,
    "Xfer duration": "0:00:00",
    "Avg. Xfer duration": "0:00:00",
    "Shift duration": "74:19:54",
    "Answered per net hour": 9.77,
    "Answered per gross hour": 3.57,
    "Answered per gross hour (IDLE=WORK)": 0.85,
    "Net employment": "10 %",
    "Gross employment (IDLE=WORK)": "85 %",
    "Gross employment (IDLE=WORK,OUT=AutoAdmin)": "84 %",
    "Gross employment": "9 %",
    "Idle duration": "56:39:40",
    "Idle percentage": "76.23 %",
    "Avg. duration between calls": "0:33:20",
    "Lunch breaks": 3,
    "Lunch duration": "2:12:37",
    "Administrative breaks": 5,
    "Administrative duration": "0:01:21",
    "Private breaks": 44,
    "Private duration": "9:00:47",
    "Other breaks": 0,
    "Other duration": "0:00:00",
    "Training breaks": 0,
    "Training duration": "0:00:00",
    "Team Meeting breaks": 0,
    "Team Meeting duration": "0:00:00",
    "Brief breaks": 0,
    "Brief duration": "0:00:00",
    "Total work statuses amount": 5,
    "Total work statuses duration": "0:01:21",
    "Total non-work statuses amount": 47,
    "Total non-work statuses duration": "11:13:24",
    "Hold count": 14,
    "Hold duration": "0:05:56",
    "Hold Percentage": "1.35 %"
}]

