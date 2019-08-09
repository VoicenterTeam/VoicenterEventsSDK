<template>
    <div>
        <component :is="componentTypes[widget.TemplateID]"
                   :data="setComponentData(widget.TemplateID)"
                   v-bind="widget.WidgetLayout"
                   :editable="editable"
                   class="widget"
                   @update-item="(layout) => updateWidget(layout, widget)"
                   @remove-item="removeWidget(widget)">
        </component>
    </div>
</template>
<script>

    import WidgetCard from "./WidgetCard"
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import DataTable from '@/components/Table/DataTable'
    import widgetTypes from '@/enum/widgetTypes'

    export default {
        name: "widget",
        components: {
            WidgetCard,
            TimeLineChart,
            DataTable,
        },
        data() {
            return {
                componentTypes: {
                    [widgetTypes.WIDGET_TYPE_ID]: 'WidgetCard',
                    [widgetTypes.CHART_TYPE_ID]: 'TimeLineChart',
                    [widgetTypes.TABLE_TYPE_ID]: 'DataTable',
                },
            }
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            },
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        methods: {
            removeWidget(widget) {
                this.$emit('remove-item', widget)
            },
            updateWidget(widget) {
                this.$emit('update-item', widget)
            },
            setComponentData(TemplateID) {
                if (TemplateID === '2') {
                    return this.widget;
                }
                return this.widget.WidgetLayout
            }
        }
    }
</script>
<style>

</style>
