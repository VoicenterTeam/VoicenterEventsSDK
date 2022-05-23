<template>
    <div
        :class="getClass"
        class="grid-stack-item-content relative rounded-lg flex flex-col h-full w-full"
        :key="widget.WidgetID"
        :style="getStyles"
    >
        <div class="flex relative items-center">
            <div class="flex relative overflow-auto w-full flex-row items-center justify-between widget-header py-2"
                 v-if="showDeleteButton"
            >
                <i class="icon-lg text-primary mx-2" :class="widget.WidgetTemplateIcon"/>
                <base-widget-title :title="widget.Title" v-if="showWidgetTitle"/>
                <portal-target :name="`widget-header__${widget.WidgetID}`"
                               class="hidden lg:flex w-full items-center justify-between"/>
            </div>
            <span v-if="showDeleteButton && showInfoButton" class="px-2 py-1-5" @click="showPreviewInfoDialog = true">
                    <i class="vc-icon-info icon-lg text-gray-700 cursor-help hover:text-primary"/>
            </span>
            <WidgetAction
                :key="widget.WidgetID"
                :editable="editable"
                :edit-mode="editMode"
                :widget="widget"
                @on-manage-notes="tryManageNotes"
                @on-add-note="onAddNote"
                v-if="showDeleteButton"
                @on-duplicate="duplicateWidget"
                @on-remove="removeWidget"
                @on-show-update-dialog="showUpdateDialog = true"
            />
        </div>
        <div class="flex w-full flex-col widget-container h-full contents"
             v-if="inView">
            <component
                :data="widget"
                :editable="editable"
                :is="getComponentTypeAndSetData(widget)"
                :onEditMode="editMode"
                @on-update="(data) => onUpdate(data)"
                @remove-item="removeWidget(widget)"
                @duplicate-widget="duplicateWidget(widget)"
                @on-show-info="onShowInfo"
                ref="widget"
                class="widget"
                v-bind="widget.WidgetLayout">
            </component>
            <portal-target
                v-if="haveFooterPortal"
                :name="`widget-footer__${widget.WidgetID}`"
            />
        </div>
        <component
            :is="getDialogComponent"
            :visible.sync="showUpdateDialog"
            :widget="widget"
            @on-update="(data) => onUpdate(data)"
            v-if="showUpdateDialog"
            v-on="$listeners"
            width="45%"
        />
        <template-preview-info-dialog
            v-if="showPreviewInfoDialog"
            :visible.sync="showPreviewInfoDialog"
            :templateHelp="templateHelp"
            :widget-title="widget.Title"
            @on-close="showPreviewInfoDialog = false"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import { Switch, Tooltip } from 'element-ui'
    import widgetDataTypes from '@/enum/widgetDataTypes'
    import { TABLE_TYPE_ID, INFO_TYPE_ID } from '@/enum/widgetDataTypes'
    import { defaultColors } from '@/enum/defaultWidgetSettings'
    import widgetComponentTypes from '@/enum/widgetComponentTypes'
    import {
        getWidgetDataType,
        getWidgetEndpoint,
        getWidgetRefreshInterval,
        isHtmlEditor,
        isNoteListWidget,
    } from '@/helpers/widgetUtils'

    const DEFAULT_WIDGET_TIME = {
        type: 'relative',
        datedeff: '0',
        Date_interval: '0',
        label: 'widget.time.today',
    }

    const EXCEPTIONS = [
        widgetDataTypes.COUNTER_TYPE_ID,
        widgetDataTypes.HISTORY_COUNTERS,
        widgetDataTypes.QUEUE_COUNTER_TYPE_ID,
        widgetDataTypes.TOTAL_OUTGOING_CALLS,
        widgetDataTypes.AVERAGE_CALLS_DURATION,
    ]

    export default {
        components: {
            PieChart: () => import('@/components/Charts/PieChart'),
            TableData: () => import('./Data/Table/TableData'),
            GaugeChart: () => import('@/components/Charts/GaugeChart'),
            QueueChart: () => import('@/components/Charts/QueueChart'),
            QueueCards: () => import('@/components/Cards/QueueCards'),
            AreaChart: () => import('@/components/Charts/AreaChart'),
            HtmlWidget: () => import('./ExternalData/HtmlWidget'),
            XaxisChart: () => import('@/components/Charts/XaxisChart'),
            StatusCards: () => import('@/components/Cards/StatusCards'),
            UpdateDialog: () => import('./UpdateDialog'),
            ConfigDialog: () => import('./ExternalData/ConfigDialog'),
            WidgetAction: () => import('@/components/Widgets/WidgetAction'),
            TimeLineChart: () => import('@/components/Charts/TimeLineChart'),
            WidgetNoteList: () => import('@/components/Widgets/WidgetNoteList'),
            ExtensionCards: () => import('@/components/Cards/ExtensionCards'),
            QueueDashboard: () => import('./Data/Queue/QueueDashboard'),
            StatisticsCards: () => import('@/components/Cards/StatisticsCards'),
            QueueActiveCall: () => import('./Data/Queue/QueueActiveCall'),
            TotalOutgoingCall: () => import('@/components/Cards/TotalOutgoingCall'),
            ExternalDataWidget: () => import('./ExternalData/ExternalDataWidget'),
            AverageCallDuration: () => import('@/components/Cards/AverageCallDuration'),
            [Switch.name]: Switch,
            [Tooltip.name]: Tooltip,
            TemplatePreviewInfoDialog: () => import("@/components/Widgets/AddWidgetsForm/TemplatePreviewInfoDialog"),
            SocketsRealTimeFunnel: () => import('@/components/Charts/FunnelChart.vue')
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            widget: {
                type: Object,
                default: () => ({}),
            },
            layoutType: {
                type: String,
                default: () => '',
            },
            inViewById: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showUpdateDialog: false,
                TABLE_DATA_TYPE_ID: '4',
                editMode: false,
                showPreviewInfoDialog: false,
                templateHelp: {}
            }
        },
        computed: {
            haveFooterPortal() {
                return get(this.widget, 'DataTypeID', -1) === TABLE_TYPE_ID || INFO_TYPE_ID
            },
            showWidgetTitle() {
                return get(this.widget.WidgetLayout, 'displayWidgetTitle', true)
            },
            inView() {
                return this.inViewById[this.widget.WidgetID] || true
            },
            showDeleteButton() {

                let dataType = getWidgetDataType(this.widget)
                return !EXCEPTIONS.includes(dataType)
            },
            getDialogComponent() {
                if (this.widget.DataTypeID === widgetDataTypes.EXTERNAL_DATA_TYPE_ID) {
                    return 'ConfigDialog'
                }
                return 'UpdateDialog'
            },
            getPadding() {
                const padding = get(this.widget.WidgetLayout, 'padding', 2)
                return { padding: `${padding}px` }
            },
            getStyles() {
                let styles = {}
                let colors = get(this.widget.WidgetLayout, 'colors') || defaultColors

                styles = {
                    'background': colors.background,
                    'color': colors.fonts,
                }
                const padding = this.getPadding

                if (this.showDeleteButton) {
                    let border = { 'border': '2px solid ' + colors.frames }
                    styles = {
                        ...styles,
                        ...border,
                        ...padding,
                    }
                }
                return cloneDeep(styles)
            },
            getClass() {
                const DataTypeID = get(this.widget, 'DataTypeID', '0')
                if (DataTypeID.toString() === this.TABLE_DATA_TYPE_ID) {
                    return 'has-margin'
                }
            },
            showInfoButton() {
                return get(this.templateHelp, "Items", []).length > 0
            }
        },
        methods: {
            isHtmlEditor,
            isNoteListWidget,
            tryManageNotes() {
                this.editMode = !this.editMode
            },
            removeWidget() {
                this.$emit('remove-item', this.widget)
            },
            duplicateWidget() {
                this.$emit('duplicate-widget', this.widget)
            },
            onUpdate(widget) {
                this.editMode = false
                this.$emit('update-item', widget)
            },
            getComponentTypeAndSetData(widget) {
                let dataTypeId = getWidgetDataType(widget)
                let refreshInterval = getWidgetRefreshInterval(widget)
                let componentType = widgetComponentTypes[dataTypeId]
                let endPoint = this.setComponentEndPoint(widget)
                if (componentType === 'SocketsRealTimeTable') {
                    componentType = 'TableData'
                }

                this.$set(widget, 'ComponentType', componentType)
                this.$set(widget, 'DataTypeID', dataTypeId)
                this.$set(widget, 'EndPoint', endPoint)
                this.$set(widget, 'DefaultRefreshInterval', refreshInterval)
                return componentType
            },
            setComponentEndPoint(widget) {
                return getWidgetEndpoint(widget)
            },
            checkWidgetTimeConfig() {
                if (this.widget.WidgetTime.hasOwnProperty('datedeff')) {
                    const timeConfig = {
                        ...DEFAULT_WIDGET_TIME,
                        ...this.widget.WidgetTime,
                    }
                    this.$set(this.widget, 'WidgetTime', timeConfig)
                }
            },
            onAddNote() {
                try {
                    this.$refs.widget.onAddNote()
                } catch (e) {
                    console.log(e)
                }
            },
            onShowInfo() {
                this.showPreviewInfoDialog = true
            },
            getHelpByWidgetsTemplateID() {
                const templateId = get(this.widget, "TemplateID")
                if (!templateId) {
                    this.templateHelp = {}
                    return
                }

                const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](templateId)
                this.templateHelp = get(helpData, 'Help', {})
            },
        },
        mounted() {
            this.checkWidgetTimeConfig()
            this.getHelpByWidgetsTemplateID()

            const { editMode } = this.widget.WidgetLayout || false
            this.editMode = editMode
        },
    }
</script>
<style lang="scss" scoped>
.widget {
    @apply rounded-lg h-full;
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
</style>
