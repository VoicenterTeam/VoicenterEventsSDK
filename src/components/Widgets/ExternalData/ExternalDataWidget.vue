<template>
    <div>
        <div v-if="!data.WidgetLayout.ComponentTypeID"
             class="w-full bg-white p-6 -my-4 text-center rounded">
            {{ $t('widget.selectAWidgetType) }}
        </div>
        <component
            v-else
            :is="getComponentType"
            :data="data"
            v-bind="data.WidgetLayout"
            :editable="editable"
            class="widget">
        </component>
    </div>
</template>
<script>
    import TableData from '../Data/Table/TableData'
    import PieChart from '@/components/Charts/PieChart'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import CounterCard from '@/components/Cards/CounterCard'
    import { defaultColors } from '@/enum/defaultWidgetSettings'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import Funnel3DChart from '@/components/Charts/Funnel3DChart'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'
    
    export default {
        components: {
            Funnel3DChart,
            CounterCard,
            GaugeChart,
            TableData,
            TimeLineChart,
            PieChart,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            getComponentType() {
                return widgetComponentTypes[this.data.WidgetLayout.ComponentTypeID]
            },
        },
        watch: {
            data: {
                immediate: true,
                handler: function (widget) {
                    this.data.colors = widget.WidgetLayout.colors || defaultColors
                },
            },
        },
    }
</script>
