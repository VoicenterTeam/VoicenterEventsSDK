<template>
    <DraggableList :disabled="!editable"
                   :value="widgets"
                   @change="(ev) => onListChange(ev)"
                   group="widgetTemplates">
        <div :class="getWidgetClass(widget)"
             :key="widget.WidgetID"
             :style="getStyles(widget)"
             class="px-2"
             v-for="widget in widgets">
            <WidgetErrorBoundary>
                <Widget :editable="editable"
                        :widget="widget"
                        @remove-item="removeWidget(widget)"
                        @update-item="(data) => updateWidget(data)"
                        v-on="$listeners">
                </Widget>
            </WidgetErrorBoundary>
        </div>
        <widget-empty-card :widgetGroup="widgetGroup" @add-widget="(value) => addWidgetsToGroup(value)"
                           key="-1"
                           v-bind="$attrs"
                           v-if="editable"
                           v-on="$listeners">
        </widget-empty-card>
        <div class="w-full flex flex-col items-center mt-20"
             key="no-data"
             v-if="widgets.length === 0">
            <IconNoData class="h-56 w-56" v-if="!editable"/>
            <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
        </div>
    </DraggableList>
</template>
<script>
    import Widget from './Widget'
    import DraggableList from './DraggableList'
    import WidgetEmptyCard from './WidgetEmptyCard'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import {defaultWidths} from '@/enum/defaultWidgetSettings'
    import WidgetErrorBoundary from '@/components/WidgetErrorBoundary'

    export default {
        name: "widget-list",
        components: {
            Widget,
            WidgetEmptyCard,
            DraggableList,
            WidgetErrorBoundary,
        },
        data () {
            return {}
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
            onListChange (ev) {
                this.$emit('onListChange', {'event': ev, 'group': this.widgetGroup})
            },
            addWidgetsToGroup (val) {
                let objectToEmit = {
                    widgets: [val],
                    group: this.widgetGroup
                }
                this.$emit('addWidgetsToGroup', objectToEmit)
            },
            removeWidget (val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget (val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
            getWidgetClass (widget) {
                if ([widgetDataTypes.COUNTER_TYPE_ID, widgetDataTypes.QUEUE_COUNTER_TYPE_ID, widgetDataTypes.TOTAL_OUTGOING_CALLS].includes(widget.DataTypeID)) {
                    return 'lg:w-auto flex-1'
                }

                if (!widget.WidgetLayout.widths) {
                    this.$set(widget.WidgetLayout, 'widths', defaultWidths)
                }
                let widths = widget.WidgetLayout.widths

                return `${widths.mobile} lg:${widths.desktop} md:${widths.tablet}`
            },
            getStyles (widget) {
                if ([widgetDataTypes.COUNTER_TYPE_ID, widgetDataTypes.QUEUE_COUNTER_TYPE_ID, widgetDataTypes.TOTAL_OUTGOING_CALLS].includes(widget.DataTypeID)) {
                    return {
                        'max-width': widget.WidgetLayout['maxWidth'] ? widget.WidgetLayout['maxWidth'] + 'px' : '400px',
                        'min-width': widget.WidgetLayout['minWidth'] ? widget.WidgetLayout['minWidth'] + 'px' : '250px',
                    }
                }
            },
        },
    }
</script>
