let storageColors = localStorage.getItem('colors')
if (storageColors) {
    try {
        storageColors = JSON.parse(storageColors)
    } catch (e) {
        storageColors = {}
    }
} else {
    storageColors = {}
}
export const settings = {
    report: {
        interval: 5,
        switching: false,
        refresh: false
    },
    colors: {
        primary: storageColors.primary || "#2575FF",
        primary_rgba: storageColors.primary_rgba ||  "37, 117, 255",
        background: storageColors.background ||  "#edf2f7",
        frames: storageColors.frames || "#ff000000",
        widgetGroupBackground: storageColors.widgetGroupBackground || "#edf2f7",
        widgetGroupFrames: storageColors.widgetGroupFrames || "#ff000000",
        widgetGroupTitles: storageColors.widgetGroupTitles || '#000000'
    },
    showWidgetAsTabs: false,
    showWidgetTitles: true,
    fontSize: defaultFontSize,
    widgetTitlesFontSize: 22,
    minRefreshInterval: 10,
    refreshRealTimeDataDelay: 30
}

export const defaultFontSize = '16px';
