import store from '@/store/store'

export default function setRequestInfo (res) {
    const currentTime = new Date().getTime()
    const startTime = res.config.headers.RequestStartTime
    const requestDuration = currentTime - startTime
    const url = res.config.url
    if (url.includes('WidgetsData/') || url.includes('/DashBoards/Get/')) {
        const regExpRule = /\/(?:[0-9]\/|[0-9])+$/gm
        const widgetId = url.match(regExpRule).map(el => el.replace('/', ''))
        store.dispatch('axiosRequestsDuration/setRequestInfo', {
            url: res.config.url,
            duration: requestDuration,
            widgetId: Number(widgetId[0])
        })
    }
}