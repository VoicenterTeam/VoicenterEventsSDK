<template>
    <el-tabs v-model="activeTab" v-bind="$attrs">
        <el-tab-pane v-for="(widget, index) in filteredWidgets" :label="widget.Title"
                     :name="widget.WidgetID.toString()"
                     :key="index">
            <WidgetErrorBoundary v-if="activeTab.toString() === widget.WidgetID.toString()">
                <Widget :widget="widget"
                        :editable="editable"
                        @remove-item="removeWidget(widget)"
                        @update-item="(data) => updateWidget(data)">
                </Widget>
            </WidgetErrorBoundary>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import get from 'lodash/get'
    import {Tabs, TabPane} from 'element-ui'
    import Widget from './Widget'
    import WidgetErrorBoundary from "@/components/WidgetErrorBoundary";

    export default {
        inheritAttrs: false,
        components: {
            Widget,
            WidgetErrorBoundary,
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane,
        },
        props: {
            widgetGroup: {
                type: Object,
                default: null
            },
            widgets: {
                type: Array,
                default: () => []
            },
            widgetsFilter: {
                type: String,
                default: ''
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                activeTab: get(this.widgets, '[0].WidgetID').toString()
            };
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
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget(val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
        },
    }
</script>
