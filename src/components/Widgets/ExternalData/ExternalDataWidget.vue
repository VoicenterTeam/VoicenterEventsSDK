<template>
    <div>
        <div v-if="!data.WidgetLayout.ComponentTypeID" class="w-full bg-white p-6 -my-4 text-center rounded">
            {{$t('Select a widget type')}}
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
                return widgetComponentTypes[this.data.WidgetLayout.ComponentTypeID]
            }
        },
    }
</script>
