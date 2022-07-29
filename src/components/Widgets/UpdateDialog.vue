<template>
    <modal v-bind="$attrs" v-if="model.WidgetLayout" v-on="$listeners" :appendToBody="true"
           class="update-dialog_wrapper">
        <template v-slot:title>
            <div class="flex flex-row items-center">
                <h3 class="text-main-2xl font-semibold text-gray-700" slot="title">{{ $t('widget.update') }}</h3>
                <static-widget-info :widget="widget" class="px-2"/>
            </div>
        </template>
        <el-form :model="model" :rules="rules"
                 class="py-6"
                 @submit.native.prevent="onChange"
                 ref="updateWidget">
            <el-form-item>
                <label>{{ $t('widget.title') }}</label>
                <el-input v-model="model.Title"/>
            </el-form-item>
            <el-form-item v-if="'DefaultRefreshInterval' in model && !isFunnelChartWidget(widget) && !isSocketsRealTimeTableWidget(widget)">
                <WidgetRefreshInterval :model="model"/>
            </el-form-item>
            <el-form-item v-if="isMultiQueuesDashboard(widget)">
                <div class="flex w-full flex-col lg:flex-row">
                    <div class="flex lg:w-1/3">
                        <el-checkbox class="pt-4" v-model="model.WidgetLayout.showStatsInPercentage">
                            {{ $t('widget.showStatsInPercentage') }}
                        </el-checkbox>
                    </div>
                    <div class="flex lg:w-1/3">
                        <el-checkbox class="pt-4" v-model="model.WidgetLayout.displayQueuesAsRow">
                            {{ $t('widget.config.displayQueuesAsRows') }}
                        </el-checkbox>
                    </div>
                    <div class="flex lg:w-1/3">
                        <el-checkbox class="pt-4" v-model="model.WidgetLayout.displayRowWithTotals">
                            {{ $t('widget.displayTheRowWithTotals') }}
                        </el-checkbox>
                    </div>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueGauge(widget)">
                <div class="flex justify-between">
                    <div>
                        <label>{{ $t('widget.config.maximumRangeValue') }}</label>
                    </div>
                    <el-input-number :max="1000" :min="1" :step="2" type="number"
                                     v-model="model.WidgetLayout.maximumRange"/>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueTable(widget) || isQueueGauge(widget)">
                <div>
                    <label>{{ $t('queues.to.display') }}</label>
                </div>
                <base-select
                    :data="allQueues"
                    :labelKey="'QueueName'"
                    :valueKey="'QueueID'"
                    v-model="model.WidgetLayout.showQueues"/>
            </el-form-item>
            <el-form-item v-if="isQueueGauge(widget)">
                <el-checkbox v-model="model.WidgetLayout.showWaitingTimeTable">
                    {{ $t('widget.showWaitingTimeTable') }}
                </el-checkbox>
            </el-form-item>
            <el-form-item v-if="isQueueChart(widget)">
                <div class="flex w-full flex-col lg:flex-row">
                    <div class="flex lg:w-1/2">
                        <el-form-item :label="$t('queues.to.display')">
                            <base-select
                                :data="allQueues"
                                :labelKey="'QueueName'"
                                :valueKey="'QueueID'"
                                v-model="model.WidgetLayout.showQueues"/>
                        </el-form-item>
                    </div>
                    <div class="flex lg:w-1/2">
                        <el-form-item :label="$t('blocks.to.display')">
                            <base-select
                                :class="$rtl.isRTL ? 'lg:pr-2' : 'lg:pl-2'"
                                :data="allSeries"
                                :labelKey="'label'"
                                :valueKey="'value'"
                                v-model="model.WidgetLayout.showSeries"/>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueDashboardWidget(widget)">
                <label>{{ $t('statistics.to.display') }}</label>
                <base-select
                    :data="statistics"
                    v-model="model.WidgetLayout.ShowStatistics"
                    valueKey="key"/>
                <div class="flex w-full flex-col lg:flex-row">
                    <div class="flex lg:w-1/2">
                        <el-checkbox v-model="model.WidgetLayout.SumOfOthers">
                            {{ $t('widget.displayPercentOfOthersValue') }}
                        </el-checkbox>
                    </div>
                    <div class="flex lg:w-1/2">
                        <el-checkbox v-model="model.WidgetLayout.AbsoluteNumbers">
                            {{ $t('widget.displayAbsoluteNumbers') }}
                        </el-checkbox>
                    </div>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueActivityGauge(widget)">
                <el-collapse v-model="activeCollapse">
                    <el-collapse-item :title="$t('widget.config')" name="queueActivity">
                        <ActivityGaugeConfig :model="model"></ActivityGaugeConfig>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-collapse v-model="activeCollapse">
                <el-collapse-item class="py-4" :title="$t('widget.layout')" name="layout">
                    <el-form-item v-if="isHtmlEditor(widget)">
                        <el-checkbox v-model="model.WidgetLayout.showLastUpdateDate">
                            {{ $t('widget.displayLastUpdateDate') }}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item v-if="isNoteListWidget(widget)">
                        <el-checkbox v-model="model.WidgetLayout.displayWidgetTitle">
                            {{ $t('widget.displayWidgetTitle') }}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item class="pb-8" v-if="isQueueDashboardWidget(widget)">
                        <div class="py-4">
                            <div>
                                <label>{{ $t('widget.config.cardTitleFontSize') }}</label>
                            </div>
                            <el-input-number
                                :max="cardTitleFontSizes.max"
                                :min="cardTitleFontSizes.min"
                                :step="1"
                                size="small"
                                v-model="model.WidgetLayout.titleFontSize">
                            </el-input-number>
                        </div>
                        <div class="py-4">
                            <div>
                                <label>{{ $t('widget.config.cardValueFontSize') }}</label>
                            </div>
                            <el-input-number
                                :max="cardValueFontSizes.max"
                                :min="cardValueFontSizes.min"
                                :step="1"
                                size="small"
                                v-model="model.WidgetLayout.valueFontSize">
                            </el-input-number>
                        </div>
                    </el-form-item>
                    <el-form-item class="pb-4" v-if="isQueueGauge(widget)">
                        <div>
                            <label>{{ $t('widget.statusLabelFontSize') }}</label>
                        </div>
                        <el-input-number
                            :max="textFontSizes.max"
                            :min="textFontSizes.min"
                            :step="1"
                            size="small"
                            v-model="model.WidgetLayout.labelFontSize">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item class="pb-4" v-if="isPieWidget(widget)">
                        <div>
                            <label>{{ $t('widget.statusLabelFontSize') }}</label>
                        </div>
                        <el-input-number
                            :max="textFontSizes.max"
                            :min="textFontSizes.min"
                            :step="1"
                            size="small"
                            v-model="model.WidgetLayout.labelFontSize">
                        </el-input-number>
                        <div class="flex flex-row items-center pt-10">
                            <div>
                                <label>{{ $t('widget.dataLabelsColor') }}</label>
                            </div>
                            <el-color-picker
                                :predefine="predefinedColors"
                                class="mx-4"
                                v-model="model.WidgetLayout.dataLabelsColor"/>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <widget-padding :model="model"/>
                    </el-form-item>
                    <el-form-item v-if="isChartWidget(widget) && !isQueueGauge(widget)">
                        <el-checkbox v-model="model.WidgetLayout.displayLegend">
                            {{ $t('widget.displayLegend') }}
                        </el-checkbox>
                    </el-form-item>
                    <widget-colors :availableColors="availableColors" :model="model"/>
                </el-collapse-item>
            </el-collapse>
            <el-form-item v-if="!isFunnelChartWidget(widget) && !isSocketsRealTimeTableWidget(widget)">
                <div v-if="model.WidgetTime.type">
                    <time-frame
                        :model="model"
                        :timeFrameType="model.WidgetTime.type"
                        :widgetTimeOptions="widgetTimeOptions">
                        <template v-slot:frame-types>
                            <BaseRadioGroup
                                v-model="model.WidgetTime.type"
                                :radios="createWidgetTimeTypes"
                                class="radio-groups mb-5"
                            />
                        </template>
                    </time-frame>
                </div>
            </el-form-item>
            <real-time-settings
                :data="widget"
                :model="model"
                v-if="isRealtimeWidget(widget) && model.settings">
            </real-time-settings>
            <div class="flex items-center text-main-base my-4"
                 v-if="autoCompletes.length">
                {{ $t('tooltip.refresh.entities.list') }}
                <RefreshButton
                    :disabled="loadEntitiesList"
                    :loading="loadEntitiesList"
                    @click.native="refreshEntitiesList"
                    class="mx-2"/>
            </div>
            <el-collapse v-if="autoCompletes.length" v-model="activeCollapse">
                <el-collapse-item :title="$t('settings.filters')" name="filters">
                    <auto-complete
                        :key="index"
                        :model="model.WidgetConfig[index]"
                        v-for="(filter, index) in model.WidgetConfig"
                        v-if="isAutoComplete(filter)"/>
                        <el-checkbox
                            v-model="model.WidgetLayout.hideLoggedOff"
                            v-if="Number(model.TemplateID) === 75"
                        >
                            <span class="text-gray-950">
                                {{ $t('widget.hideLoggedOff') }}
                            </span>
                        </el-checkbox>
                </el-collapse-item>
            </el-collapse>
            <el-collapse class="pt-6" v-if="otherFilters.length" v-model="activeCollapse">
                <el-collapse-item :title="$t('settings.other.filters')" name="otherFilters">
                    <other-filters
                        :key="index"
                        :model="model.WidgetConfig[index]"
                        v-for="(filter, index) in model.WidgetConfig"
                        v-if="isOtherFilters(filter)"/>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template v-slot:footer>
            <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                <cancel-button
                    @on-click="toggleVisibility(false)"
                />
                <confirm-button
                    :label="$t('common.save')"
                    icon="IconSave"
                    @on-click="onChange"
                />
            </div>
        </template>
    </modal>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import { Checkbox, Collapse, CollapseItem, ColorPicker, InputNumber, Slider } from 'element-ui'
    import queueMixin from '@/mixins/queueMixin'
    import { getAllSeries } from '@/enum/queueConfigs'
    import { statistics } from '@/enum/queueDashboardStatistics'
    import { realTimeWidgetRules } from '@/enum/widgetUpdateRules'
    import { widgetTimeOptions, widgetTimeTypes } from '@/enum/widgetTimeOptions'
    import { defaultAreaChartColors, defaultColors, realTimeSettings, defaultQueueChartColors } from '@/enum/defaultWidgetSettings'
    import { isChartWidget } from '@/helpers/widgetUtils'
    import {
        isAreaChartWidget,
        isHtmlEditor,
        isMultiQueuesDashboard,
        isNoteListWidget,
        isPieWidget,
        isQueueActivityGauge,
        isQueueChart,
        isQueueDashboardWidget,
        isQueueGauge,
        isQueueTable,
        isRealtimeWidget,
        isFunnelChartWidget,
        isSocketsRealTimeTableWidget
    } from '@/helpers/widgetUtils'
    import { areaChartWidgetColors, defaultWidgetColors, queueChartWidgetColors, queueGaugeWidgetColors } from '@/enum/layout'
    import values from 'lodash/values'
    import uniq from 'lodash/uniq'

    const AUTO_COMPLETE_PARAMETER_TYPE = 6

    export default {
        inheritAttrs: false,
        mixins: [queueMixin],
        components: {
            RealTimeSettings: () => import('./WidgetUpdateForm/RealTimeSettings'),
            TimeFrame: () => import('./WidgetUpdateForm/WidgetTime/TimeFrame'),
            Modal: () => import('@/components/Common/Modal'),
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Checkbox.name]: Checkbox,
            [Checkbox.name]: Checkbox,
            [InputNumber.name]: InputNumber,
            // [Slider.name]: Slider,
            [ColorPicker.name]: ColorPicker,
            AutoComplete: () => import('./WidgetUpdateForm/Filters/AutoComplete'),
            OtherFilters: () => import('./WidgetUpdateForm/Filters/OtherFilters'),
            WidgetColors: () => import('./WidgetUpdateForm/WidgetLayout/WidgetColors'),
            WidgetPadding: () => import('./WidgetUpdateForm/WidgetLayout/WidgetPadding'),
            RefreshButton: () => import('@/components/RefreshButton'),
            StaticWidgetInfo: () => import('./WidgetUpdateForm/StaticWidgetInfo'),
            ActivityGaugeConfig: () => import('@/components/Widgets/WidgetUpdateForm/WidgetLayout/exceptions/ActivityGaugeConfig'),
            WidgetRefreshInterval: () => import('@/components/Widgets/WidgetUpdateForm/WidgetLayout/WidgetRefreshInterval'),
            CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
            ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
        },
        props: {
            widget: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                widgetTimeOptions,
                widgetTimeTypes,
                model: {
                    settings: realTimeSettings,
                    colors: cloneDeep(defaultColors),
                },
                activeCollapse: ['filters'],
                loadEntitiesList: false,
                statistics,
                AUTO_COMPLETE_PARAMETER_TYPE,
                textFontSizes: {
                    min: 12,
                    max: 64,
                },
                textSizeBestOptions: {
                    16: '16px',
                    24: '24px',
                    32: '32px',
                    40: '40px',
                    48: '48px',
                    56: '56px',
                },
                cardTitleFontSizes: {
                    min: 12,
                    max: 64,
                },
                cardTitleBestOptions: {
                    16: '16px',
                    24: '24px',
                    32: '32px',
                    48: '48px',
                    56: '56px',
                },
                cardValueFontSizes: {
                    min: 24,
                    max: 128,
                },
                cardValueBestOptions: {
                    32: '32px',
                    48: '48px',
                    64: '64px',
                    80: '80px',
                    96: '96px',
                    112: '112px',
                }
            }
        },
        computed: {
            allSeries() {
                return getAllSeries(this.$store.getters['entities/accountStatuses'])
            },
            availableColors() {
                switch (true) {
                    case isAreaChartWidget(this.widget):
                        return areaChartWidgetColors
                    case isQueueChart(this.widget):
                        return queueChartWidgetColors
                    case isQueueGauge(this.widget):
                        return queueGaugeWidgetColors
                    default:
                        return defaultWidgetColors
                }
            },
            predefinedColors() {
                let options = values(this.$store.getters['layout/colors']('activeLayout'))
                return uniq(options)
            },
            rules() {
                if (isRealtimeWidget(this.widget)) {
                    return realTimeWidgetRules(this.model)
                }
                return {}
            },
            autoCompletes() {
                return this.widget.WidgetConfig.filter(c => c.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            otherFilters() {
                return this.widget.WidgetConfig.filter(c => c.ParameterType && c.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE)
            },
            createWidgetTimeTypes () {
                return this.widgetTimeTypes
                    .map(el => {
                        return {
                            label: el.text, value: el.label
                        }
                    })
            }
        },
        methods: {
            isHtmlEditor,
            isPieWidget,
            isQueueTable,
            isQueueChart,
            isQueueGauge,
            isRealtimeWidget,
            isQueueActivityGauge,
            isQueueDashboardWidget,
            isMultiQueuesDashboard,
            isNoteListWidget,
            isFunnelChartWidget,
            isSocketsRealTimeTableWidget,
            isChartWidget,
            isAutoComplete(WidgetConfig) {
                return WidgetConfig.ParameterType === this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            isOtherFilters(WidgetConfig) {
                return WidgetConfig.ParameterType !== this.AUTO_COMPLETE_PARAMETER_TYPE
            },
            onChange() {
                this.$refs.updateWidget.validate((valid) => {

                    if (!valid) return

                    if (this.model.WidgetTime.type === 'relative') {
                        let widgetTime = widgetTimeOptions.find((el) => el.Date_interval === this.model.WidgetTime.Date_interval)
                        this.model.WidgetTime = {
                            ...this.model.WidgetTime,
                            ...widgetTime,
                        }
                    }

                    this.model.WidgetLayout = {
                        ...this.model.WidgetLayout,
                        ...{ settings: this.model.settings },
                        ...{ colors: this.model.colors },
                    }

                    try {
                        this.model.WidgetConfig.forEach((config) => {

                            if (config.ParameterType !== AUTO_COMPLETE_PARAMETER_TYPE) {
                                delete config.WidgetParameterValueJson
                                return
                            }

                            if (typeof config.WidgetParameterValue === 'object') {
                                config.WidgetParameterValue['AccountList'] = [this.$store.state.entities.selectedAccountID]
                                config.WidgetParameterValue = JSON.stringify(config.WidgetParameterValue)
                            }

                            if (typeof config.WidgetParameterValueJson !== 'object') {
                                return
                            }

                            if (config.WidgetParameterValueJson['EntityPositive'].length) {
                                config.WidgetParameterValueJson['AccountList'] = [this.$store.state.entities.selectedAccountID]
                            } else {
                                config.WidgetParameterValueJson['AccountList'] = []
                            }

                        })
                    } catch (e) {
                        console.warn(e)
                    }

                    this.$emit('on-update', this.model)
                    this.toggleVisibility(false)
                })
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
            async refreshEntitiesList() {
                this.loadEntitiesList = true
                await this.$store.dispatch('entities/getEntitiesList')
                this.loadEntitiesList = false
            },
        },
        mounted() {
            this.model = cloneDeep(this.widget)

            this.model.colors = this.model.WidgetLayout.colors || cloneDeep(defaultColors)

            if (isQueueGauge(this.widget)) {
                this.model.colors = { ...defaultQueueChartColors, ...this.model.WidgetLayout.colors }
            }

            if (isAreaChartWidget(this.widget)) {
                this.model.colors = { ...defaultAreaChartColors, ...this.model.WidgetLayout.colors }
            }

            if (isRealtimeWidget(this.widget)) {
                this.model.settings = this.widget.WidgetLayout.settings || realTimeSettings
            }

            if (isQueueChart(this.widget) && !this.widget.WidgetLayout.showQueues) {
                this.model.WidgetLayout.showQueues = this.queueWithActiveCalls.map((el) => el.QueueID)
                this.model.WidgetLayout.showSeries = [0, 1, 2, 3, 4, 5, 6]
            }
            this.model.Title = this.$t(this.widget.Title)
        },
    }
</script>

<style lang="scss" scoped>
.update-dialog_wrapper ::v-deep {
    .el-form-item {
        @apply w-full mb-2;
        .el-select {
            @apply w-full;
        }
    }
}
.radio-groups {
    @apply flex;
}
.radio-groups .vc-form-radio:last-child {
    @apply ml-8;
}
</style>
