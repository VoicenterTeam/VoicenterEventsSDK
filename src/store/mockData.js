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
      "RelativeTimeData": {
      }
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
      "RelativeTimeData": {
      }
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
      "RelativeTimeData": {
      }
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
      "RelativeTimeData": {
      }
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
        "Title": "widgetGroups.general.title",
        "WidgetList": [widgets[0], widgets[1], widgets[2], widgets[3]]
      }
    ]
  },
  "dashboard2": {
    "ID": 2,
    "Title": "dashboards.queue",
    "WidgetGroupList": [
      {
        "ID": 23,
        "Title": "widgetGroups.queue.title",
        "WidgetList": [...widgets]
      }
    ]
  }
}
