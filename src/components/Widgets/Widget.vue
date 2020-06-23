<template>
    <div :class="getClass" class="grid-stack-item-content relative mt-1">
        <div class="flex w-full flex-row items-center justify-between widget-header" v-if="showDeleteButton">
            <base-widget-title :title="widget.Title" v-if="showWidgetTitle"/>
            <portal-target :name="`widget-header__${widget.WidgetID}`" class="hidden lg:flex w-full justify-between"/>
            <div class="flex">
                <div class="widget-delete__button" v-if="editable">
                    <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark" placement="top">
                        <delete-button @click="removeWidget(widget)"/>
                    </el-tooltip>
                </div>
                <div class="widget-edit__button">
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-button :class="{'border border-primary': editable}"
                                     @click="showUpdateDialog = true">
                        </edit-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="flex w-full flex-col h-full widget-container" v-if="inView">
            <component
                :data="widget"
                :editable="editable"
                :is="getComponentTypeAndSetData(widget)"
                :style="getStyles"
                @on-update="(data) => onUpdate(data)"
                @remove-item="removeWidget(widget)"
                class="widget h-full"
                v-bind="widget.WidgetLayout">
            </component>
            <portal-target :class="{'h-14': showDeleteButton}" :name="`widget-footer__${widget.WidgetID}`"/>
        </div>
        <component
            :is="getDialogComponent"
            :visible.sync="showUpdateDialog"
            :widget="widget"
            @on-update="(data) => onUpdate(data)"
            v-if="showUpdateDialog"
            v-on="$listeners"
            width="45%">
        </component>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Tooltip} from 'element-ui'
    import WidgetCard from './WidgetCard'
    import UpdateDialog from './UpdateDialog'
    import WidgetNoteList from './WidgetNoteList'
    import TableData from './Data/Table/TableData'
    import EditButton from '@/components/EditButton'
    import HtmlWidget from './ExternalData/HtmlWidget'
    import PieChart from '@/components/Charts/PieChart'
    import AreaChart from '@/components/Charts/AreaChart'
    import DeleteButton from '@/components/DeleteButton'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import ConfigDialog from './ExternalData/ConfigDialog'
    import QueueCards from '@/components/Cards/QueueCards'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import QueueChart from '@/components/Charts/QueueChart'
    import StatusCards from '@/components/Cards/StatusCards'
    import QueueDashboard from './Data/Queue/QueueDashboard'
    import QueueActiveCall from './Data/Queue/QueueActiveCall'
    import {defaultColors} from '@/enum/defaultWidgetSettings'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import TotalOutgoingCall from '@/components/Cards/TotalOutgoingCall'
    import AverageCallDuration from '@/components/Widgets/Data/Queue/AverageCallDuration'
    import XaxisChart from '@/components/Charts/XaxisChart'
    import ExtensionCards from '@/components/Cards/ExtensionCards'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'
    import StatisticsCards from '@/components/Cards/StatisticsCards'
    import ExternalDataWidget from './ExternalData/ExternalDataWidget'
    import {getWidgetDataType, getWidgetEndpoint, getWidgetRefreshInterval} from '@/helpers/widgetUtils'

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
            QueueActiveCall,
            ExternalDataWidget,
            ConfigDialog,
            PieChart,
            HtmlWidget,
            QueueDashboard,
            TotalOutgoingCall,
            XaxisChart,
            AreaChart,
            WidgetNoteList,
            AverageCallDuration,
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
            layoutType: {
                type: String,
                default: () => ""
            },
            inViewById: {
                type: Object,
                default: () => ({})
            },
        },
        data () {
            return {
                showUpdateDialog: false,
                loading: false,
                TABLE_DATA_TYPE_ID: '4',
            }
        },
        computed: {
            showWidgetTitle() {
                return get(this.widget.WidgetLayout, 'displayWidgetTitle', true)
            },
            inView() {
                return this.inViewById[this.widget.WidgetID] || true
            },
            showDeleteButton () {
                let exceptions = [
                    widgetDataTypes.COUNTER_TYPE_ID,
                    widgetDataTypes.HISTORY_COUNTERS,
                    widgetDataTypes.INFO_TYPE_ID,
                    widgetDataTypes.QUEUE_COUNTER_TYPE_ID,
                    widgetDataTypes.TOTAL_OUTGOING_CALLS,
                ]
                let dataType = getWidgetDataType(this.widget)
                return !exceptions.includes(dataType)
            },
            getDialogComponent () {
                if (this.widget.DataTypeID === widgetDataTypes.EXTERNAL_DATA_TYPE_ID) {
                    return 'ConfigDialog'
                }
                return 'UpdateDialog'
            },
            getStyles () {
                let styles = {};
                let colors = get(this.widget.WidgetLayout, 'colors') || defaultColors;

                styles = {
                    'background': colors.background,
                    'color': colors.fonts,
                }

                if (this.showDeleteButton) {
                    let border = {'border': '2px solid' + colors.frames}
                    styles = {
                        ...styles,
                        ...border,
                        ...this.getPadding
                    }
                }
                return styles;
            },
            getClass () {
                const DataTypeID = get(this.widget, 'DataTypeID', '0')

                if (DataTypeID.toString() === this.TABLE_DATA_TYPE_ID) {
                    return 'has-margin'
                }
            }
        },
        methods: {
            removeWidget (widget) {
                this.$emit('remove-item', widget)
            },
            onUpdate (widget) {
                this.$emit('update-item', widget)
            },
            getComponentTypeAndSetData (widget) {
                let dataTypeId = getWidgetDataType(widget)
                let refreshInterval = getWidgetRefreshInterval(widget)
                let componentType = widgetComponentTypes[dataTypeId]
                let endPoint = this.setComponentEndPoint(widget)

                this.$set(widget, 'ComponentType', componentType)
                this.$set(widget, 'DataTypeID', dataTypeId)
                this.$set(widget, 'EndPoint', endPoint)
                this.$set(widget, 'DefaultRefreshInterval', refreshInterval)
                return componentType
            },
            setComponentEndPoint (widget) {
                return getWidgetEndpoint(widget)
            },
        },
        mounted() {
            this.getComponentTypeAndSetData(this.widget)
        }
    }
</script>
<style lang="scss" scoped>
    .rtl {
        .widget-edit__button {
            right: auto;
            @apply left-0;
        }

        .widget-delete__button {
            right: auto;
            @apply left-0;
            + .widget-edit__button {
                right: auto;
                @apply left-0 ml-10;
            }
        }
    }

    .widget {
        @apply rounded-lg;
    }
</style>
<style lang="scss">
    .grid-stack > .grid-stack-item > .grid-stack-item-content {
        overflow: inherit;

        .widget {
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .grid-stack > .grid-stack-item > .grid-stack-item-content.has-margin {
        @apply mb-8;
    }
</style>
