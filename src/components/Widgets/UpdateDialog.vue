<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" v-if="model.WidgetLayout">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="model.Title"/>
                </div>
            </el-form-item>
            <el-collapse v-model="activeCollapse" class="pt-4">
                <el-collapse-item :title="$t('widget.layout')" name="layout">
                    <el-form-item>
                        <widget-width :model="model"/>
                    </el-form-item>
                    <el-form-item>
                        <widget-padding :model="model"/>
                    </el-form-item>
                    <el-form-item>
                        <widget-font-size :model="model"/>
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
                                <el-radio v-for="widgetTimeType in widgetTimeTypes" v-bind="widgetTimeType">
                                    {{widgetTimeType.text}}
                                </el-radio>
                            </el-radio-group>
                        </template>
                    </time-frame>
                </div>
            </el-form-item>
            <real-time-settings
                v-if="isRealtimeWidget(widget)"
                :data="widget"
                :model="model">
            </real-time-settings>
            <div v-if="model.WidgetConfig">
                <div class="flex items-center justify-between">
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
                            v-if="isAutoComplete(filter)"
                            :model="model.WidgetConfig[index]"/>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeCollapse" class="pt-4" v-if="otherFilters.length">
                    <el-collapse-item :title="$t('settings.other.filters')" name="otherFilters">
                        <other-filters
                            v-for="(filter, index) in model.WidgetConfig"
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
    </el-dialog>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Collapse, CollapseItem, Dialog, Radio, RadioGroup, Checkbox, Tooltip} from 'element-ui'
    import RefreshButton from '@/components/RefreshButton'
    import {filterIDs} from '@/enum/widgetTemplateConfigs'
    import {realTimeWidgetRules} from '@/enum/widgetUpdateRules'
    import TimeFrame from './WidgetUpdateForm/WidgetTime/TimeFrame'
    import OtherFilters from './WidgetUpdateForm/Filters/OtherFilters'
    import RealTimeSettings from './WidgetUpdateForm/RealTimeSettings'
    import AutoComplete from './WidgetUpdateForm/Filters/AutoComplete'
    import {isRealtimeWidget, isPieWidget} from '@/helpers/widgetUtils'
    import WidgetColors from './WidgetUpdateForm/WidgetLayout/WidgetColors'
    import WidgetWidth from './WidgetUpdateForm/WidgetLayout/WidgetWidth'
    import WidgetPadding from './WidgetUpdateForm/WidgetLayout/WidgetPadding'
    import WidgetFontSize from "./WidgetUpdateForm/WidgetLayout/WidgetFontSize";
    import {widgetTimeOptions, widgetTimeTypes} from '@/enum/widgetTimeOptions'
    import {realTimeSettings, defaultColors} from '@/enum/defaultWidgetSettings'

    export default {
        inheritAttrs: false,
        components: {
            WidgetWidth,
            RealTimeSettings,
            TimeFrame,
            [Radio.name]: Radio,
            [Dialog.name]: Dialog,
            [RadioGroup.name]: RadioGroup,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Checkbox.name]: Checkbox,
            AutoComplete,
            OtherFilters,
            WidgetColors,
            WidgetPadding,
            WidgetFontSize,
            RefreshButton,
            [Tooltip.name]: Tooltip,
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
                    timeInterval: {},
                },
                activeCollapse: ['filters'],
                loadEntitiesList: false,
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
                        ...{width: this.model.WidgetLayout.width},
                        ...{fontSize: this.model.WidgetLayout.fontSize},
                    }

                    try {
                        this.model.WidgetConfig.forEach((config) => {
                            config.WidgetParameterValue = config.WidgetParameterValue.join()
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
            if (isRealtimeWidget(this.widget)) {
                this.model.settings = this.widget.WidgetLayout.settings || realTimeSettings
            }
            this.model.colors = cloneDeep(this.model.WidgetLayout.colors || defaultColors)
            if (isPieWidget(this.widget)) {
                this.model.hideLoggedOutUsers = this.widget.WidgetLayout.hideLoggedOutUsers || true
            }
        },
    }
</script>
