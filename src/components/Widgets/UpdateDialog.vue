<template>
    <modal v-bind="$attrs" v-on="$listeners" v-if="model.WidgetLayout">
        <div class="flex flex-row items-center">
            <h3 slot="title" class="text-main-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
            <static-widget-info class="px-2" :widget="widget"/>
        </div>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="model.Title"/>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueTable(widget) || isQueueGauge(widget)">
                <label>{{$t('queues.to.display')}}</label>
                <base-select
                    v-model="model.WidgetLayout.showQueues"
                    :data="allQueues"
                    :labelKey="'QueueName'"
                    :valueKey="'QueueID'"/>
            </el-form-item>
            <el-form-item v-if="isQueueChart(widget)">
                <div class="flex w-full flex-col lg:flex-row">
                    <div class="flex lg:w-1/2">
                        <el-form-item :label="$t('queues.to.display')">
                            <base-select
                                v-model="model.WidgetLayout.showQueues"
                                :data="allQueues"
                                :labelKey="'QueueName'"
                                :valueKey="'QueueID'"/>
                        </el-form-item>
                    </div>
                    <div class="flex lg:w-1/2">
                        <el-form-item :label="$t('blocks.to.display')">
                            <base-select
                                :class="$rtl.isRTL ? 'lg:pr-2' : 'lg:pl-2'"
                                v-model="model.WidgetLayout.showSeries"
                                :data="allSeries"
                                :labelKey="'label'"
                                :valueKey="'value'"/>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item v-if="isQueueDashboardWidget(widget)">
                <label>{{$t('statistics.to.display')}}</label>
                <base-select
                    v-model="model.WidgetLayout.ShowStatistics"
                    valueKey="key"
                    :data="statistics"/>
                <div class="flex w-full flex-col lg:flex-row pt-4">
                    <div class="flex lg:w-1/2">
                        <el-checkbox v-model="model.WidgetLayout.SumOfOthers">
                            {{$t('Display % of of Others value')}}
                        </el-checkbox>
                    </div>
                    <div class="flex lg:w-1/2">
                        <el-checkbox v-model="model.WidgetLayout.AbsoluteNumbers">
                            {{$t('Display absolute numbers')}}
                        </el-checkbox>
                    </div>
                </div>
            </el-form-item>
            <el-collapse v-model="activeCollapse" class="pt-4">
                <el-collapse-item :title="$t('widget.layout')" name="layout">
                    <el-form-item>
                        <widget-width :model="model"/>
                    </el-form-item>
                    <el-form-item v-if="isHtmlWidget(widget)">
                        <widget-height :model="model"/>
                    </el-form-item>
                    <el-form-item>
                        <widget-padding :model="model"/>
                    </el-form-item>
                    <widget-colors :model="model"/>
                </el-collapse-item>
            </el-collapse>
            <el-form-item v-if="isPieWidget(widget)">
                <el-checkbox v-model="model.WidgetLayout.hideLoggedOutUsers" class="pt-4">
                    {{$t('Don`t count logged out agents')}}
                </el-checkbox>
            </el-form-item>
            <el-form-item>
                <div v-if="model.WidgetTime && widget.WidgetTime.Date_interval">
                    <time-frame
                        :model="model"
                        :timeFrameType="model.WidgetTime.type"
                        :widgetTimeOptions="widgetTimeOptions">
                        <template v-slot:frame-types>
                            <el-radio-group v-model="model.WidgetTime.type" class="pb-4">
                                <el-radio v-for="widgetTimeType in widgetTimeTypes" v-bind="widgetTimeType"
                                          :key="widgetTimeType.text">
                                    {{widgetTimeType.text}}
                                </el-radio>
                            </el-radio-group>
                        </template>
                    </time-frame>
                </div>
            </el-form-item>
            <real-time-settings
                v-if="isRealtimeWidget(widget) && model.settings"
                :data="widget"
                :model="model">
            </real-time-settings>
            <div v-if="autoCompletes.length ||otherFilters.length ">
                <div class="flex items-center justify-between text-main-base">
                    {{$t('tooltip.refresh.entities.list')}}
                    <RefreshButton
                        :disabled="loadEntitiesList"
                        :loading="loadEntitiesList"
                        @click.native="refreshEntitiesList"/>
                </div>
                <el-collapse v-model="activeCollapse" class="pt-4" v-if="autoCompletes.length">
                    <el-collapse-item :title="$t('settings.filters')" name="filters">
                        <auto-complete
                            v-for="(filter, index) in model.WidgetConfig"
                            :key="index"
                            v-if="isAutoComplete(filter)"
                            :model="model.WidgetConfig[index]"/>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeCollapse" class="pt-4" v-if="otherFilters.length">
                    <el-collapse-item :title="$t('settings.other.filters')" name="otherFilters">
                        <other-filters
                            v-for="(filter, index) in model.WidgetConfig"
                            :key="index"
                            v-if="isOtherFilters(filter)"
                            :model="model.WidgetConfig[index]"/>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </modal>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Checkbox, Collapse, CollapseItem, Radio, RadioGroup, Tooltip} from 'element-ui'
    import Modal from "@/components/Common/Modal";
    import queueMixin from '@/mixins/queueMixin'
    import {allSeries} from '@/enum/queueConfigs'
    import RefreshButton from '@/components/RefreshButton'
    import {filterIDs} from '@/enum/widgetTemplateConfigs'
    import {realTimeWidgetRules} from '@/enum/widgetUpdateRules'
    import TimeFrame from './WidgetUpdateForm/WidgetTime/TimeFrame'
    import OtherFilters from './WidgetUpdateForm/Filters/OtherFilters'
    import RealTimeSettings from './WidgetUpdateForm/RealTimeSettings'
    import StaticWidgetInfo from './WidgetUpdateForm/StaticWidgetInfo'
    import AutoComplete from './WidgetUpdateForm/Filters/AutoComplete'
    import WidgetWidth from './WidgetUpdateForm/WidgetLayout/WidgetWidth'
    import WidgetHeight from './WidgetUpdateForm/WidgetLayout/WidgetHeight'
    import WidgetColors from './WidgetUpdateForm/WidgetLayout/WidgetColors'
    import WidgetPadding from './WidgetUpdateForm/WidgetLayout/WidgetPadding'
    import {widgetTimeOptions, widgetTimeTypes} from '@/enum/widgetTimeOptions'
    import {defaultColors, realTimeSettings} from '@/enum/defaultWidgetSettings'
    import {statistics} from '@/enum/queueDashboardStatistics'
    import {
        isHtmlWidget,
        isPieWidget,
        isQueueChart,
        isQueueDashboardWidget,
        isQueueGauge,
        isQueueTable,
        isRealtimeWidget,
    } from '@/helpers/widgetUtils'

    export default {
        inheritAttrs: false,
        mixins: [queueMixin],
        components: {
            WidgetWidth,
            RealTimeSettings,
            TimeFrame,
            Modal,
            [Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Checkbox.name]: Checkbox,
            AutoComplete,
            OtherFilters,
            WidgetColors,
            WidgetPadding,
            WidgetHeight,
            RefreshButton,
            [Tooltip.name]: Tooltip,
            StaticWidgetInfo,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                widgetTimeOptions: widgetTimeOptions,
                widgetTimeTypes: widgetTimeTypes,
                model: {
                    settings: realTimeSettings,
                    colors: defaultColors,
                },
                activeCollapse: ['filters'],
                loadEntitiesList: false,
                statistics,
                allSeries,
            }
        },
        computed: {
            rules() {
                if (isRealtimeWidget(this.widget)) {
                    return realTimeWidgetRules(this.model)
                }
                return {}
            },
            autoCompletes() {
                return this.widget.WidgetConfig.filter(c => c.ParameterID && filterIDs.includes(c.ParameterID))
            },
            otherFilters() {
                return this.widget.WidgetConfig.filter(c => c.ParameterID && !filterIDs.includes(c.ParameterID))
            },
        },
        methods: {
            isRealtimeWidget,
            isPieWidget,
            isQueueTable,
            isQueueChart,
            isQueueGauge,
            isHtmlWidget,
            isQueueDashboardWidget,
            isAutoComplete(WidgetConfig) {
                return filterIDs.includes(WidgetConfig.ParameterID);
            },
            isOtherFilters(WidgetConfig) {
                return !filterIDs.includes(WidgetConfig.ParameterID);
            },
            onChange() {
                this.$refs.updateWidget.validate((valid) => {

                    if (!valid) return;

                    if (this.model.WidgetTime.type === 'relative') {
                        let widgetTime = widgetTimeOptions.find((el) => el.datedeff === this.model.WidgetTime.datedeff)
                        this.model.WidgetTime = {
                            ...this.model.WidgetTime,
                            ...widgetTime
                        }
                    }

                    this.model.WidgetLayout = {
                        ...this.model.WidgetLayout,
                        ...{settings: this.model.settings},
                        ...{colors: this.model.colors},
                    }

                    try {
                        this.model.WidgetConfig.forEach((config) => {
                            if (typeof config.WidgetParameterValue === 'object') {
                                config.WidgetParameterValue = JSON.stringify(config.WidgetParameterValue)
                            }
                        })
                    } catch (e) {
                    }
                    this.$emit('on-update', this.model)
                    this.toggleVisibility(false);
                })
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
            async refreshEntitiesList() {
                this.loadEntitiesList = true
                await this.$store.dispatch('entities/getEntitiesList')
                this.loadEntitiesList = false
            }
        },
        mounted() {
            this.model = cloneDeep(this.widget)
            this.model.colors = this.model.WidgetLayout.colors || defaultColors

            if (isRealtimeWidget(this.widget)) {
                this.model.settings = this.widget.WidgetLayout.settings || realTimeSettings
            }
            if (isPieWidget(this.widget)) {
                this.model.hideLoggedOutUsers = this.widget.WidgetLayout.hideLoggedOutUsers || true
            }

            if (isQueueChart(this.widget) && !this.widget.WidgetLayout.showQueues) {
                this.model.WidgetLayout.showQueues = this.queueWithActiveCalls.map((el) => el.QueueID)
                this.model.WidgetLayout.showSeries = [0, 1, 2, 3, 4, 5]
            }
        },
    }
</script>

<style lang="scss">
    .el-form-item {
        @apply w-full;
        .el-select {
            @apply w-full;
        }
    }
</style>
