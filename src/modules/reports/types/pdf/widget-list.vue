<template>
    <div class="w-full pdf-widget-list h-full">
        <div>
            <div v-for="group in widgetGroupList"
                 class="grid grid-cols-12 h-full"
                 :key="group.WidgetGroupID">
                <component v-for="(widget, index) in group.WidgetList"
                           :is="getComponentTypeAndSetData(widget)"
                           :key="`widget-key${widget.WidgetID + index}`"
                           class="overflow-hidden"
                           :id="`widget-${widget.WidgetID + index}`"
                           :data="widget"
                           :columns-to-display="columnsToDisplay"
                           :column-min-width="columnMinWidth"
                           :class="getGridClass(widget)"
                           :style="widget.styles"
                />
                <!--                :style="getWidgetStyles(widget)"-->
            </div>
        </div>
    </div>
</template>
<script>
    import PdfDraw from '@/mixins/pdf-draw-mixin'
    import { getWidgetDataType, getWidgetEndpoint } from '@/helpers/widgetUtils'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'

    function delay(time) {
        return new Promise((resolve) => {
            return setTimeout(resolve, time)
        })
    }
    
    const PDF_PAGE_HEIGHT = 1100
    
    export default {
        mixins: [PdfDraw],
        components: {
            TableData: () => import('@/components/Widgets/Data/Table/TableData'),
            HtmlWidget: () => import('@/components/Widgets/ExternalData/HtmlWidget'),
            PieChart: () => import('@/components/Charts/PieChart'),
            AreaChart: () => import('@/components/Charts/AreaChart'),
            QueueChart: () => import('@/components/Charts/QueueChart'),
            GaugeChart: () => import('@/components/Charts/GaugeChart'),
            XaxisChart: () => import('@/components/Charts/XaxisChart'),
            StatusCards: () => import('@/components/Cards/StatusCards'),
            TimeLineChart: () => import('@/components/Charts/TimeLineChart'),
            ExtensionCards: () => import('@/components/Cards/ExtensionCards'),
            QueueDashboard: () => import('@/components/Widgets/Data/Queue/QueueDashboard'),
            QueueActiveCall: () => import('@/components/Widgets/Data/Queue/QueueActiveCall'),
            TotalOutgoingCall: () => import('@/components/Cards/TotalOutgoingCall'),
            ExternalDataWidget: () => import('@/components/Widgets/ExternalData/ExternalDataWidget')
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => ({}),
            },
        },
        data() {
            return {
                columnsToDisplay: 6,
                columnMinWidth: 122,
                allWidgets: [],
            }
        },
        methods: {
            getGridClass(widget) {
                const cols = widget.WidgetLayout.GridLayout.width
                return `col-span-${cols}`
            },
            getComponentTypeAndSetData(widget) {
                let dataTypeId = getWidgetDataType(widget)
                let componentType = widgetComponentTypes[dataTypeId]
                let endPoint = this.setComponentEndPoint(widget)
                
                this.$set(widget, 'ComponentType', componentType)
                this.$set(widget, 'DataTypeID', dataTypeId)
                this.$set(widget, 'EndPoint', endPoint)
                return componentType
            },
            setComponentEndPoint(widget) {
                return getWidgetEndpoint(widget)
            },
            computedWidgetWrappers() {
                const elements = document.querySelectorAll('[id*="widget-"]')
                for (let i = 0; i < elements.length; i++) {
                    this.setWidgetStyles(i)
                }
            },
            getGridElement(widget) {
                const { GridLayout } = widget.WidgetLayout
                return GridLayout
            },
            checkIfNextRowNotTruncated(lastWidgetHeight, lastWidgetIndex) {
                let cols = 0
                while (cols < 12 && lastWidgetIndex <= this.allWidgets.length) {
                    const widget = this.allWidgets[++lastWidgetIndex]
                    if (!widget) {
                        return
                    }
                    const { height, x } = this.getGridElement(widget)
                    cols += x
                    if ((height * 80 + lastWidgetHeight) > PDF_PAGE_HEIGHT) {
                        return PDF_PAGE_HEIGHT - lastWidgetHeight
                    }
                }
                return 0
            },
            setWidgetStyles(index) {
                const widget = this.allWidgets[index]
                if (!widget) {
                    return
                }
                
                let  { height } = this.getGridElement(widget) || 1
                height = height * 80
                
                const marginBottom = this.checkIfNextRowNotTruncated(height, index + 1)
                
                this.$set(widget, 'styles', {
                    height: `${height}px !important`,
                    'margin-bottom': `${marginBottom}px !important`,
                })
            },
            mapAllWidgets() {
                this.widgetGroupList.forEach(group => {
                    this.allWidgets.push(...group.WidgetList)
                })
            },
        },
        async mounted() {
            await delay(2000)
            this.mapAllWidgets()
            this.computedWidgetWrappers()
        },
    }
</script>
<style lang="scss">
.pdf-widget-list {
    @apply px-6;
    .el-table th {
        font-size: 10px;
        font-weight: bold;
        padding: 0;
        line-height: 10px;
    }
    
    .el-table td {
        padding: 5px 0;
        font-size: 10px;
        
        > div.cell {
            overflow-wrap: normal;
            word-break: normal;
        }
    }
    
    .chart-content_wrapper {
        max-height: 100% !important;
        min-height: 100% !important;
    }
}
</style>
