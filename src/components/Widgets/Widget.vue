<template>
    <div class="relative">
        <div v-if="!loading">
            <div class="absolute top-0 right-0 mr-12 widget-delete__button" v-if="editable && showDeleteButton">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                    <delete-button @click="removeWidget(widget)"/>
                </el-tooltip>
            </div>
            <div class="absolute top-0 right-0 widget-edit__button" v-if="showDeleteButton">
                <el-tooltip class="item" effect="dark" :content="$t('tooltip.edit.widget')" placement="top">
                    <edit-button @click="onShowUpdateDialog(widget.WidgetLayout.DataTypeID)"
                                 :class="{'border border-primary': editable}">
                    </edit-button>
                </el-tooltip>
            </div>
        </div>
        <component :is="componentTypes[widget.WidgetLayout.DataTypeID]"
                   :data="widget"
                   v-bind="widget.WidgetLayout"
                   :editable="editable"
                   class="widget"
                   @on-loading="(state) => onLoading(state)"
                   @change-extension-status="(status)=> changeExtensionStatus(status, widget)"
                   @remove-item="removeWidget(widget)">
        </component>
        <!--TODO: set dynamic edit dialog for all widget types-->
        <update-dialog
                width="30%"
                v-if="showUpdateDialog"
                :chartTitle="widget.WidgetLayout.caption"
                @on-change="(title) => onChangeTitle(title, widget)"
                :visible.sync="showUpdateDialog">
        </update-dialog>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import WidgetCard from "./WidgetCard"
    import UpdateDialog from './UpdateDialog'
    import TableData from './Data/Table/TableData'
    import DataByUser from './Data/Table/DataByUser'
    import EditButton from '@/components/EditButton'
    import DeleteButton from '@/components/DeleteButton'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import GaugeChart from '@/components/Charts/GaugeChart'
    import QueueChart from '@/components/Charts/QueueChart'
    import StatusCards from '@/components/Cards/StatusCards'
    import TimeLineChart from '@/components/Charts/TimeLineChart'
    import ExtensionCards from '@/components/Cards/ExtensionCards'
    import StatisticsCards from '@/components/Cards/StatisticsCards'

    const editableWidgets = [1, 2, 3]

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
            DataByUser
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
                    [widgetDataTypes.COUNTER_TYPE_ID]: 'ExtensionCards',
                    // TODO: TBD dataTypes from API
                    [widgetDataTypes.CHART_GAUGE_ID]: 'GaugeChart',
                    [widgetDataTypes.CHART_QUEUE_ID]: 'QueueChart',
                    [widgetDataTypes.STATUS_CARDS_TYPE_ID]: 'StatusCards',
                    [widgetDataTypes.STATISTICS_CARDS_TYPE_ID]: 'StatisticsCards',
                    [widgetDataTypes.REAL_TIME_USER_TABLE_ID]: 'DataByUser',
                },
                showUpdateDialog: false,
                loading: false
            }
        },
        computed: {
            showDeleteButton() {
                return ![widgetDataTypes.STATUS_CARDS_TYPE_ID, widgetDataTypes.STATISTICS_CARDS_TYPE_ID, widgetDataTypes.CHART_GAUGE_ID].includes(Number(this.widget.TemplateID))
            }
        },
        methods: {
            removeWidget(widget) {
                this.$emit('remove-item', widget)
            },
            onShowUpdateDialog(DataTypeID) {
                alert('coming soon...')
                return false
            },
            onChangeTitle(title, widget) {
                widget.WidgetLayout.caption = title
                widget = {...widget, ...widget.WidgetLayout}
                this.$emit('update-item', widget)
            },
            changeExtensionStatus(status, widget) {
                widget.WidgetLayout.status = status
                this.$emit('update-item', this.widget)
            },
            onLoading(state) {
                this.loading = state
            }
        }
    }
</script>
<style scoped lang="scss">
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
                @apply ml-10;
                @apply left-0;
            }
        }

    }
</style>
