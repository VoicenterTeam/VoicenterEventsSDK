<template>
    <el-tabs v-model="activeTab" v-bind="$attrs" class="widget-tabs">
        <el-tab-pane v-for="(tab, index) in tabsData" :label="tab.title"
                     :name="tab.key"
                     :key="index">
            <div :class="{'flex flex-wrap -mx-2': tab.groupedWidgets}">
                <div
                    class="w-full px-2"
                    v-for="widget in tab.widgets"
                    :class="getWidgetDataTypeClass(widget)">
                    <WidgetErrorBoundary v-if="activeTab.toString() === tab.key">
                        <Widget :widget="widget"
                                :editable="editable"
                                v-on="$listeners"
                                @remove-item="removeWidget(widget)"
                                @update-item="(data) => updateWidget(data)">
                        </Widget>
                    </WidgetErrorBoundary>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import get from 'lodash/get'
    import {TabPane, Tabs} from 'element-ui'
    import Widget from './Widget'
    import {getDataTypeClass, getWidgetDataType, groupedWidgets} from '@/helpers/widgetUtils'
    import WidgetErrorBoundary from '@/components/WidgetErrorBoundary'

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
            editable: {
                type: Boolean,
                default: false
            },
        },
        data() {
            let firstWidgetID = get(this.widgets, '[0].WidgetID')
            return {
                activeTab: firstWidgetID ? firstWidgetID.toString() : ''
            };
        },
        computed: {
            // Grouping Widgets
            tabsData() {
                let widgets = this.widgets
                let tabs = []
                let groupedData = {}


                widgets.forEach((el) => {
                    if (!el.DataTypeID) {
                        try {
                            el.DataTypeID = getWidgetDataType(el)
                        } catch (e) {
                        }
                    }

                    if (groupedWidgets.includes(el.DataTypeID)) {
                        if (!groupedData[el.DataTypeID]) {
                            groupedData[el.DataTypeID] = {
                                widgets: [],
                                title: '',
                                key: '',
                                groupedWidgets: true
                            }
                            groupedData[el.DataTypeID].key = el.WidgetID.toString()
                            groupedData[el.DataTypeID].title = el.Title
                        }

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
                    tabs.push(...exceptionsData)
                }
                return tabs
            },

        },
        methods: {
            removeWidget(val) {
                this.$emit('removeWidget', {'widget': val, 'group': this.widgetGroup})
            },
            updateWidget(val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
            getWidgetDataTypeClass(widget) {
                return getDataTypeClass(widget)
            },
        },
    }
</script>
