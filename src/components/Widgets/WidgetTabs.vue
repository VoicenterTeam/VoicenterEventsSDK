<template>
    <el-tabs v-model="activeTab" v-bind="$attrs">
        <el-tab-pane v-for="(widget, index) in filteredWidgets" :label="widget.Title"
                     :name="widget.WidgetID.toString()"
                     :key="index">
            <div
                v-if="activeTab.toString() === widget.WidgetID.toString()"
                class="w-full px-2"
                :class="getWidgetDataTypeClass(widget)">
                <WidgetErrorBoundary>
                    <Widget :widget="widget"
                            :editable="editable"
                            @remove-item="removeWidget(widget)"
                            @update-item="(data) => updateWidget(data)">
                    </Widget>
                </WidgetErrorBoundary>
            </div>

        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import get from 'lodash/get'
    import {Tabs, TabPane} from 'element-ui'
    import Widget from './Widget'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import {getDataTypeClass} from '@/helpers/widgetUtils'
    import WidgetErrorBoundary from '@/components/WidgetErrorBoundary'
    import {getWidgetDataType} from "../../helpers/widgetUtils";

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
            },
        },
        methods: {
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget(val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
            // Group widgets
            tabsData() {
                let widgets = this.filteredWidgets
                let tabs = []
                let groupedData = {}
                let exceptions = [widgetDataTypes.COUNTER_TYPE_ID, widgetDataTypes.CHART_SPEEDOMETER]

                widgets.forEach((el) => {
                    if (!el.DataTypeID) {
                        try {
                            el.DataTypeID = getWidgetDataType(el)
                        } catch (e) {
                        }
                    }

                    if (exceptions.includes(el.DataTypeID)) {
                        if (!groupedData[el.DataTypeID]) {
                            groupedData[el.DataTypeID] = {
                                widgets: [],
                                title: '',
                                key: ''
                            }
                        }
                        groupedData[el.DataTypeID].title = el.Title
                        groupedData[el.DataTypeID].key = el.WidgetID.toString()

                        groupedData[el.DataTypeID]['widgets'].push(el)
                    } else {
                        let new0bj = {
                            title: el.Title,
                            key: el.WidgetID.toString(),
                            widgets: [el]
                        }
                        tabs.push(new0bj)
                    }
                })

                let exceptionsData = Object.values(groupedData)

                if (exceptionsData.length) {
                    tabs.push(exceptionsData)
                }

                return tabs
            },
            getWidgetDataTypeClass(widget) {
                return getDataTypeClass(widget)
            }
        },
        mounted() {
            this.tabsData()
        }
    }
</script>
