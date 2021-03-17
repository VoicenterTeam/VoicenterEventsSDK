import bus from '@/event-bus/EventBus'

export default {
    methods: {
        triggerPrintEvent() {
            bus.$on('print-chart', (widgetID) => {
                if (this.data.WidgetID.toString() !== widgetID.toString()) {
                    return
                }
                this.tryPrintChart()
            })
        },
        triggerDownloadEvent() {
            bus.$on('download-chart', ({ type, WidgetID }) => {
                if (this.data.WidgetID.toString() !== WidgetID.toString()) {
                    return
                }
                this.tryDownloadChart(type)
            })
        },
    },
    mounted() {
        this.triggerPrintEvent()
        this.triggerDownloadEvent()
    },
}
