<template>
    <DraggableWidgets group="widgetTemplates"
                      :value="widgets"
                      :disabled="!editable"
                      @change="(ev) => onListChange(ev)">
        <div v-for="widget in filteredWidgets"
             :key="widget.WidgetID"
             class="w-full px-2" :class="componentWidth[widget.WidgetLayout.DataTypeID]">
            <Widget :widget="widget"
                    :editable="editable"
                    @remove-item="removeWidget(widget)"
                    @update-item="(data) => updateWidget(data)">
            </Widget>
        </div>
        <widget-empty-card v-if="editable" key="-1"
                           :widgetGroup="widgetGroup"
                           v-bind="$attrs"
                           v-on="$listeners"
                           @add-widget="(value) => addWidgetsToGroup(value)">
        </widget-empty-card>
        <div v-if="widgets === 0"
             class="w-full flex flex-col items-center mt-20"
             key="no-data">
            <IconNoData v-if="!editable" class="h-56 w-56"></IconNoData>
            <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
        </div>
    </DraggableWidgets>
</template>
<script>

    import Widget from './Widget'
    import WidgetEmptyCard from './WidgetEmptyCard'
    import DraggableWidgets from './DraggableWidgets'
    import widgetDataTypes from '@/enum/widgetDataTypes'

    export default {
        name: "widget-list",
        components: {
            Widget,
            WidgetEmptyCard,
            DraggableWidgets,
        },
        data() {
            return {
                componentWidth: {
                    [widgetDataTypes.LINES_TYPE_ID]: 'lg:w-3/3',
                    [widgetDataTypes.BARS_WITH_LINES_TYPE_ID]: 'lg:w-3/3',
                    [widgetDataTypes.TIMELINE_TYPE_ID]: 'lg:w-3/3',
                    [widgetDataTypes.TABLE_TYPE_ID]: 'lg:w-3/3',
                    [widgetDataTypes.COUNTER_TYPE_ID]: 'lg:w-3/3',
                    // TODO: TBD dataTypes from API
                    [widgetDataTypes.CHART_GAUGE_ID]: 'lg:w-1/3',
                    [widgetDataTypes.CHART_QUEUE_ID]: 'lg:w-3/3',
                    [widgetDataTypes.STATISTICS_CARDS_TYPE_ID]: 'lg:w-1/3',
                    [widgetDataTypes.STATUS_CARDS_TYPE_ID]: 'lg:w-1/3',
                    [widgetDataTypes.REAL_TIME_USER_TABLE_ID]: 'lg:w-3/3',
                }
            }
        },
        props: {
            widgetGroup: {
                type: Object,
                default: null
            },
            editable: {
                type: Boolean,
                default: false
            },
            widgets: {
                type: Array,
                default: () => []
            },
            widgetsFilter: {
                type: String,
                default: ''
            }
        },
        computed: {
            filteredWidgets() {
                return this.widgets.filter((widget) => widget.Title.toLowerCase().includes(this.widgetsFilter.toLowerCase()))
            }
        },
        methods: {
            onListChange(ev) {
                this.$emit('onListChange', {'event': ev, 'group': this.widgetGroup})
            },
            addWidgetsToGroup(val) {
                this.$emit('addWidgetsToGroup', {'widgets': [val], 'group': this.widgetGroup})
            },
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget(val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            }
        },
    }
</script>
<style>

</style>
