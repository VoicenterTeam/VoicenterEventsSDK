<template>
    <component :is="getComponentType()"
               :data="data"
               v-bind="data.WidgetLayout"
               :editable="editable"
               class="widget">
    </component>
</template>
<script>
    import DefaultCard from './DefaultCard'
    import TableData from '../Data/Table/TableData'
    import {externalDataModel} from '@/models/instances'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import StatusCards from '@/components/Cards/StatusCards'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'

    export default {
        components: {
            DefaultCard,
            StatusCards,
            GaugeChart,
            TableData,
            TimeLineChart
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
        methods: {
            getComponentType() {
                return widgetComponentTypes[this.data.WidgetLayout.SomeFieldID]
            }
        },
        mounted() {
            // console.log(this.$listeners)
        },
    }
</script>
<style lang="scss" scoped>

</style>
