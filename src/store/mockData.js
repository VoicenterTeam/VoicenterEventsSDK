export const widgets = [
  {
    "WidgetID": "2",
    "WidgetType": {
      "ID": "1",
    },
    "WidgetEntity": {},
    "WidgetLayout": {
      "Order": 1,
      "Classes": "w-full lg:w-1/3 px-2"
    },
    "WidgetTime": {
      "TimeType": "1",
      "RelativeTimeData": {
      }
    },
    "WidgetConfig": {
      "icon": "IconPhone",
      "title": 26,
      "description": "widgets.phoneNumbers.description"
    }
  },
  {
    "WidgetID": "3",
    "WidgetType": {
      "ID": "1",
    },
    "WidgetEntity": {},
    "WidgetLayout": {
      "Order": 2,
      "Classes": "w-full lg:w-1/3 px-2"
    },
    "WidgetTime": {
      "TimeType": "1",
      "RelativeTimeData": {
      }
    },
    "WidgetConfig": {
      "icon": "IconUsers",
      "title": 15,
      "description": "widgets.users.description"
    }
  },
  {
    "WidgetID": "4",
    "WidgetType": {
      "ID": "1",
    },
    "WidgetEntity": {},
    "WidgetLayout": {
      "Order": 3,
      "Classes": "w-full lg:w-1/3 px-2"
    },
    "WidgetTime": {
      "TimeType": "1",
      "RelativeTimeData": {
      }
    },
    "WidgetConfig": {
      "icon": "IconExtensions",
      "title": 38,
      "description": "widgets.extensions.description"
    }
  },
  {
    "WidgetID": "5",
    "WidgetType": {
      "ID": "1",
    },
    "WidgetEntity": {},
    "WidgetLayout": {
      "Order": 4,
      "Classes": "w-full lg:w-1/3 px-2"
    },
    "WidgetTime": {
      "TimeType": "1",
      "RelativeTimeData": {
      }
    },
    "WidgetConfig": {
      "icon": "IconStats",
      "title": 514,
      "description": "widgets.stats.description"
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
        "WidgetList": [widgets[0], widgets[1], widgets[2]]
      }
    ]
  },
  "dashboard2": {
    "ID": 1,
    "Title": "dashboards.queue",
    "WidgetGroupList": [
      {
        "ID": 23,
        "Title": "widgetGroups.general.title",
        "WidgetList": [...widgets]
      }
    ]
  }
}
