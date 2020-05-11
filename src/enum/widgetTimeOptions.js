// Date_interval: how many days back from today
// Datedeff: from that day forward how many days to aggregate

export const widgetTimeOptions = [
    {
        label: 'widget.time.today',
        datedeff: "0",
        Date_interval: "0"
    },
    {
        label: 'widget.time.yesterday',
        datedeff: "0",
        Date_interval: "1"
    },
    {
        label: 'widget.time.last_7_days',
        datedeff: "7",
        Date_interval: "7"
    },
    {
        label: 'widget.time.last_30_days',
        datedeff: "30",
        Date_interval: "30"
    },
    {
        label: 'widget.time.last_90_days',
        datedeff: "90",
        Date_interval: "90"
    },
];

export const widgetTimeTypes = [
    {
        label: 'relative',
        text: 'Relative',
    },
    {
        label: 'absolute',
        text: 'Absolute',
    },
]
