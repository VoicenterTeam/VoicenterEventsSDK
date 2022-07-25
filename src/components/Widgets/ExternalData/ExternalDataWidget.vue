<template>
    <div>
        <div v-if="!data.WidgetLayout.ComponentTypeID"
             class="w-full bg-white p-6 -my-4 text-center rounded">
            {{ $t('widget.selectAWidgetType') }}
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
    import { defaultColors } from '@/enum/defaultWidgetSettings'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'
    
    export default {
        components: {
            Funnel3DChart: () => import('@/components/Charts/Funnel3DChart'),
            CounterCard: () => import('@/components/Cards/CounterCard'),
            GaugeChart: () => import('@/components/Charts/GaugeChart'),
            TableData: () => import('../Data/Table/TableData'),
            TimeLineChart: () => import('@/components/Charts/TimeLineChart'),
            PieChart: () => import('@/components/Charts/PieChart'),
            SocketsRealTimeFunnel: () => import('@/components/Charts/FunnelChart.vue')
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
