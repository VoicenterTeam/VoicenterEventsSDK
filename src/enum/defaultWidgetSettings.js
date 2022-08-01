import colors from '@/enum/colors'

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

const defaultQueueColors = {
    answer: colors.LIGHT_GREEN,
    abandoned: colors.PRIVATE_COLOR,
    iVRExit: colors.PRIVATE_COLOR,
    pickUp: colors.LOGIN_COLOR,
    timeOutExit: colors.ADMINISTRATIVE_COLOR,
    joinEmpty: colors.LUNCH_COLOR,
    leaveEmpty: colors.PRIVATE_COLOR,
    joinUnavail: colors.PRIVATE_COLOR,
    leaveUnavail: colors.PRIVATE_COLOR,
    full: colors.OTHER_COLOR,
    nextDestination: colors.LOGOUT_COLOR,
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

export const defaultQueueDashboardColors = {
    ...defaultColors,
    ...defaultQueueColors,
    callCount: colors.QUEUE_LIGHT_GREEN,
    maxRingTime: colors.QUEUE_PRIVATE_COLOR,
    notInSLACount: colors.QUEUE_LOGOUT_COLOR,
    inSLACount: colors.QUEUE_LUNCH_COLOR,
    avgRingTime: colors.QUEUE_ADMINISTRATIVE_COLOR
}

export const defaultMultiQueuesDashboardColors = {
    ...defaultColors,
    ...defaultQueueColors
}
