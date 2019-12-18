<template>
    <component :is="getComponentType"
               :data="data"
               v-bind="data.WidgetLayout"
               :editable="editable"
               class="widget">
    </component>
</template>
<script>
    import TableData from '../Data/Table/TableData'
    import PieChart from '@/components/Charts/PieChart'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import CounterCard from '@/components/Cards/CounterCard'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'

    export default {
        components: {
            CounterCard,
            GaugeChart,
            TableData,
            TimeLineChart,
            PieChart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            getComponentType() {
                return widgetComponentTypes[this.data.WidgetLayout.SomeFieldID]
            }
        },
    }
</script>
