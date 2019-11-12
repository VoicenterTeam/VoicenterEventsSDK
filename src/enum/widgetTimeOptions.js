const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const oneDay = 1000 * 60 * 60 * 24;
const diff = now - start;
const dayOfYear = Math.floor(diff / oneDay);

export const widgetTimeOptions = [
    {
        label: 'widget.time.today',
        datedeff: 0,
        Date_interval: 1
    },
    {
        label: 'widget.time.yesterday',
        datedeff: 1,
        Date_interval: 1
    },
    {
        label: 'widget.time.this_week',
        datedeff: 7,
        Date_interval: 7
    },
    {
        label: 'widget.time.this_month',
        datedeff: now.getDate(),
        Date_interval: now.getDate()
    },
    {
        label: 'widget.time.this_year',
        datedeff: dayOfYear,
        Date_interval: dayOfYear
    },
];
