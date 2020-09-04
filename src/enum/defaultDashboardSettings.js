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

export const defaultFontSize = '16px';

export const settings = {
    report: {
        interval: 5,
        switching: false,
        refresh: false
    },
    colors: {
        primary: storageColors.primary || "#2575FF",
        primary_rgba: storageColors.primary_rgba || "37, 117, 255",
        background: storageColors.background || "#fff",
        frames: storageColors.frames || "#fff",
        widgetGroupBackground: storageColors.widgetGroupBackground || "#fff",
        widgetGroupFrames: storageColors.widgetGroupFrames || "#fff",
        widgetGroupTitles: storageColors.widgetGroupTitles || '#000000'
    },
    showWidgetTitles: true,
    fontSize: 16,
    widgetTitlesFontSize: 22,
    widgetGroupTitlesFontSize: 22,
    minRefreshInterval: 10,
    refreshRealTimeDataDelay: 30
}


