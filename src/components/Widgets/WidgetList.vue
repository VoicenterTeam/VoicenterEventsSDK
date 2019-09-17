<template>
    <DraggableWidgets group="widgets"
                      :value="widgets"
                      :disabled="!editable"
                      @change="(ev) => onListChange(ev)">
        <div v-for="(widget, index) in widgets"
             :key="index"
             class="w-full px-2" :class="componentWidth[widget.TemplateID]">
            <Widget :widget="widget"
                    :editable="editable"
                    @remove-item="removeWidget(widget)"
                    @update-item="(data) => updateWidget(data)">
            </Widget>
        </div>
        <widget-empty-card v-if="editable" key="-1"
                           :widgets="widgets"
                           :all-widgets="allWidgets"
                           :widget-group="widgetGroup"
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

    import Widget from "./Widget";
    import widgetTypes from '@/enum/widgetTypes'
    import WidgetEmptyCard from "./WidgetEmptyCard"
    import DraggableWidgets from './DraggableWidgets'

    export default {
        name: "widget-list",
        components: {
            WidgetEmptyCard,
            DraggableWidgets,
            Widget,
        },
        data() {
            return {
                componentWidth: {
                    [widgetTypes.CHART_LINE_ID]: 'lg:w-3/3',
                    [widgetTypes.CHART_BARS_ID]: 'lg:w-3/3',
                    [widgetTypes.TABLE_TYPE_ID]: 'lg:w-3/3',
                    [widgetTypes.EXTENSION_CARDS_TYPE_ID]: 'lg:w-3/3',
                    [widgetTypes.STATISTICS_CARDS_TYPE_ID]: 'lg:w-1/3',
                    [widgetTypes.STATUS_CARDS_TYPE_ID]: 'lg:w-1/3',
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
            allWidgets: {
                type: Array,
                default: () => []
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
            },
        },
    }
</script>
<style>

</style>
