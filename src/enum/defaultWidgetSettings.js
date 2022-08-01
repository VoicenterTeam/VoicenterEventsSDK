export const realTimeSettings = {
    showLoggedOutUsers: false,
    generalThreshold: false,
    generalThresholdLowValue: 0,
    generalThresholdHeightValue: 0,
    callThreshold: false,
    callThresholdLowValue: 10,
    callThresholdHeightValue: 0,
    resetIdleTime: true
}
export const defaultColors = {
    background: "#F7FAFC",
    frames: "#F7FAFC",
    fonts: '#000'
}

export const defaultAreaChartColors = {
    ...defaultColors,
    outgoing: '#61B5FE',
    incoming: '#49CA6D',
}

export const defaultCardColors = {
    background: "white",
    frames: "#000000",
    fonts: '#000000'
}

export const defaultQueueGaugeChartColors = {
    ...defaultColors,
    minimumRangeColor: '#55BF3B',
    middleRangeColor: '#DDDF0D',
    maximumRangeColor: '#DF5353'
}

export const defaultQueueChartColors = {
    ...defaultColors,
    queueCalls: '#ED64A6',
    maxWaitingTime: '#61B5FF'
}
