const PDF_PAGE_HEIGHT = 1100

export default {
    methods: {
        getGridConfig(widget) {
            const { GridLayout } = widget.WidgetLayout
            return GridLayout.height || 1
        },
        getGridHeight(widget) {
            const widgetHeight = this.getGridConfig(widget) * 80
            this.$set(widget, 'wrapperHeight', widgetHeight)
            console.log({widgetHeight})
            return {
                maxHeight: `${1020}px !important`,
                minHeight: `${1020}px !important`,
                overflow: 'hidden !important',
            }
        },
        getWidgetStyles(widget) {
            const element = document.getElementById(`widget-${widget.WidgetID}`)
            if (!element) {
                return
            }
            return {}
            const { wrapperHeight } = widget
            const offsetTop = element.offsetTop
            
            this.$nextTick(() => {
                this.computeTopMargin(offsetTop, wrapperHeight)
            })
        },
        computeTopMargin(offsetTop, widgetHeight) {
            console.log({ widgetHeight })
            const pageHeight = Math.ceil((offsetTop + widgetHeight) / PDF_PAGE_HEIGHT)
            
            if (PDF_PAGE_HEIGHT > (offsetTop + widgetHeight)) {
                return {}
            }
            
            const marginTop = (offsetTop + widgetHeight) - PDF_PAGE_HEIGHT + widgetHeight
            //console.log(`margin-top: ${marginTop}px !important;`)
            return {
                //overflow: 'hidden !important',
                //marginTop: `${marginTop}px !important`,
            }
        },
    },
}
