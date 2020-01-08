<template>
    <DraggableList group="widgetTemplates"
                   :value="widgets"
                   :disabled="!editable"
                   @change="(ev) => onListChange(ev)">
        <div v-for="widget in filteredWidgets"
             :key="widget.WidgetID"
             class="w-full px-2"
             :class="getWidgetDataTypeClass(widget)">
            <WidgetErrorBoundary>
                <Widget :widget="widget"
                        :editable="editable"
                        v-on="$listeners"
                        @remove-item="removeWidget(widget)"
                        @update-item="(data) => updateWidget(data)">
                </Widget>
            </WidgetErrorBoundary>
        </div>
        <widget-empty-card v-if="editable" key="-1"
                           :widgetGroup="widgetGroup"
                           v-bind="$attrs"
                           v-on="$listeners"
                           @add-widget="(value) => addWidgetsToGroup(value)">
        </widget-empty-card>
        <div v-if="widgets.length === 0"
             class="w-full flex flex-col items-center mt-20"
             key="no-data">
            <IconNoData v-if="!editable" class="h-56 w-56"/>
            <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
        </div>
    </DraggableList>
</template>
<script>
    import get from 'lodash/get'
    import Widget from './Widget'
    import WidgetEmptyCard from './WidgetEmptyCard'
    import {getDataTypeClass} from '@/helpers/widgetUtils'
    import DraggableList from './DraggableList'
    import WidgetErrorBoundary from "@/components/WidgetErrorBoundary";

    export default {
        name: "widget-list",
        components: {
            Widget,
            WidgetEmptyCard,
            DraggableList,
            WidgetErrorBoundary,
        },
        data() {
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
            widgetsFilter: {
                type: String,
                default: ''
            }
        },
        computed: {
            filteredWidgets() {
                return this.widgets.filter((widget) => {
                    let title = get(widget, 'Title', '').toLowerCase()
                    return title.includes(this.widgetsFilter.toLowerCase())
                })
            }
        },
        methods: {
            onListChange(ev) {
                this.$emit('onListChange', {'event': ev, 'group': this.widgetGroup})
            },
            addWidgetsToGroup(val) {
                let objectToEmit = {
                    widgets: [val],
                    group: this.widgetGroup
                }
                this.$emit('addWidgetsToGroup', objectToEmit)
            },
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget(val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
            getWidgetDataTypeClass(widget) {
                return getDataTypeClass(widget)
            }
        },
    }
</script>
