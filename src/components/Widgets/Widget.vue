<template>
    <div class="relative my-3" :class="{'mt-6 mb-0': editable}">
        <div v-if="!loading">
            <div class="absolute top-0 right-0 mt-4 mr-16 widget-delete__button"
                 v-if="editable && showDeleteButton">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                    <delete-button @click="removeWidget(widget)"/>
                </el-tooltip>
            </div>
            <div class="absolute top-0 right-0 widget-edit__button mr-4 mt-4"
                 v-if="showDeleteButton">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-button @click="showUpdateDialog = true"
                                 :class="{'border border-primary': editable}">
                    </edit-button>
                </el-tooltip>
            </div>
        </div>
        <component :is="getComponentTypeAndSetData(widget)"
                   :data="widget"
                   v-bind="widget.WidgetLayout"
                   :editable="editable"
                   class="widget"
                   :style="getStyles"
                   @on-loading="(state) => onLoading(state)"
                   @on-update="(data) => onUpdate(data)"
                   @remove-item="removeWidget(widget)">
        </component>
        <update-dialog
            width="35%"
            v-if="showUpdateDialog"
            :widget="widget"
            @on-update="(data) => onUpdate(data)"
            v-on="$listeners"
            :visible.sync="showUpdateDialog">
        </update-dialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Tooltip} from 'element-ui'
    import WidgetCard from './WidgetCard'
    import UpdateDialog from './UpdateDialog'
    import TableData from './Data/Table/TableData'
    import EditButton from '@/components/EditButton'
    import DeleteButton from '@/components/DeleteButton'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import QueueCards from '@/components/Cards/QueueCards'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import QueueChart from '@/components/Charts/QueueChart'
    import StatusCards from '@/components/Cards/StatusCards'
    import QueueActiveCall from './Data/Queue/QueueActiveCall'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import ExtensionCards from '@/components/Cards/ExtensionCards'
    import StatisticsCards from '@/components/Cards/StatisticsCards'
    import {getWidgetDataType, getWidgetEndpoint} from "@/helpers/widgetUtils";

    export default {
        name: "widget",
        components: {
            WidgetCard,
            TimeLineChart,
            ExtensionCards,
            StatusCards,
            StatisticsCards,
            TableData,
            DeleteButton,
            EditButton,
            UpdateDialog,
            [Tooltip.name]: Tooltip,
            GaugeChart,
            QueueChart,
            QueueCards,
            QueueActiveCall
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            },
            widget: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                componentTypes: {
                    [widgetDataTypes.LINES_TYPE_ID]: 'TimeLineChart',
                    [widgetDataTypes.BARS_WITH_LINES_TYPE_ID]: 'TimeLineChart',
                    [widgetDataTypes.TIMELINE_TYPE_ID]: 'TimeLineChart',
                    [widgetDataTypes.TABLE_TYPE_ID]: 'TableData',
                    [widgetDataTypes.COUNTER_TYPE_ID]: 'StatusCards',
                    [widgetDataTypes.CHART_SPEEDOMETER]: 'GaugeChart',
                    [widgetDataTypes.CHART_QUEUE]: 'QueueChart',
                    [widgetDataTypes.EXTENSION_CARDS]: 'ExtensionCards',
                    [widgetDataTypes.HISTORY_COUNTERS]: 'StatisticsCards',
                    [widgetDataTypes.REAL_TIME_TABLE]: 'TableData',
                    [widgetDataTypes.QUEUE_COUNTER_TYPE_ID]: 'QueueCards',
                    [widgetDataTypes.QUEUE_ACTIVE_CALL]: 'QueueActiveCall',
                },
                showUpdateDialog: false,
                loading: false,
            }
        },
        computed: {
            showDeleteButton() {
                let exceptions = [widgetDataTypes.COUNTER_TYPE_ID, widgetDataTypes.HISTORY_COUNTERS, widgetDataTypes.CHART_SPEEDOMETER, widgetDataTypes.QUEUE_COUNTER_TYPE_ID]
                let dataType = getWidgetDataType(this.widget)
                return !exceptions.includes(dataType)
            },
            getWidgetTemplate() {
                return this.$store.getters['widgetTemplate/getWidgetTemplate']
            },
            getStyles() {
                let styles = {};
                let colors = get(this.widget.WidgetLayout, 'colors');

                try {
                    styles = {
                        'background': colors.background,
                        'color': colors.fonts
                    }
                } catch (e) {
                    styles = {
                        'background': defaultColors.background,
                        'color': defaultColors.fonts
                    }
                }

                if(this.showDeleteButton) {
                    let border = {'border': '2px solid' + colors.frames ||defaultColors.frames}
                    styles = {
                        ...styles,
                        ...border
                    }
                }
                return styles;
            }
        },
        methods: {
            removeWidget(widget) {
                this.$emit('remove-item', widget)
            },
            onUpdate(widget) {
                this.$emit('update-item', widget)
            },
            onLoading(state) {
                this.loading = state
            },
            getComponentTypeAndSetData(widget) {
                let dataTypeId = getWidgetDataType(widget)
                let componentType = `${this.componentTypes[dataTypeId]}`
                let endPoint = this.setComponentEndPoint(widget)
                this.$set(widget, 'ComponentType', componentType)
                this.$set(widget, 'DataTypeID', dataTypeId)
                this.$set(widget, 'EndPoint', endPoint)
                return componentType
            },
            setComponentEndPoint(widget) {
                return getWidgetEndpoint(widget)
            },
        },
    }
</script>
<style scoped lang="scss">
    .rtl {
        .widget-edit__button {
            right: auto;
            @apply left-0 ml-4;
        }

        .widget-delete__button {
            right: auto;
            @apply left-0 ml-4;
            + .widget-edit__button {
                right: auto;
                @apply left-0 ml-14;
            }
        }
    }

    .widget {
        @apply p-4 rounded-lg;
    }
</style>
