<template>
    <DraggableWidgets group="widgets"
                      :value="widgets"
                      @input="(val) => onListChange(val)">
        <div v-for="widget in widgets"
             :key="widget.ID"
             class="w-full px-2" :class="componentWidth[widget.WidgetType.ID]">
            <Widget :widget="widget"
                    :editable="editable"
                    @remove-item="removeWidget(widget)">
            </Widget>
        </div>
        <widget-empty-card v-if="editable" key="0"
                           :widgets="widgets"
                           :widget-group="widgetGroup"
                           @add-widget="(value) => addWidgetToGroup(value)">
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

    import WidgetEmptyCard from "./WidgetEmptyCard"
    import DraggableWidgets from './DraggableWidgets'
    import Widget from "./Widget";

    import widgetTypes from '@/enum/widgetTypes'

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
                    [widgetTypes.WIDGET_TYPE_ID]: 'lg:w-1/3',
                    [widgetTypes.CHART_TYPE_ID]: 'lg:w-3/3',
                    [widgetTypes.TABLE_TYPE_ID]: 'lg:w-3/3',
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
        },
        methods: {
            onListChange(val) {
                this.$emit('onListChange', {'list': val, 'group': this.widgetGroup})
            },
            addWidgetToGroup(val) {
                this.$emit('addWidgetToGroup', {'widget': val, 'group': this.widgetGroup})
            },
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
        },
    }
</script>
<style>

</style>
