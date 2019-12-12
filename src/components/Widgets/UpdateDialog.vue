<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="model.Title"/>
                </div>
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
                v-if="validateComponentType(widget)"
                :data="widget"
                :model="model">
            </real-time-settings>
            <el-collapse v-model="activeCollapse" class="pt-4" v-if="filters.length && model.WidgetConfig">
                <el-collapse-item :title="$t('settings.filters')" name="filters">
                    <auto-complete
                        v-for="(filter, index) in filters"
                        :model="model.WidgetConfig[index]"/>
                </el-collapse-item>
            </el-collapse>
            <el-collapse v-model="activeCollapse" class="pt-4" v-if="otherFilters.length && model.WidgetConfig">
                <el-collapse-item :title="$t('settings.other.filters')" name="otherFilters">
                    <other-filters
                        v-for="(filter, index) in otherFilters"
                        :model="model.WidgetConfig[index]"/>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Collapse, CollapseItem, Dialog, Radio, RadioGroup} from 'element-ui'
    import AutoComplete from './WidgetUpdateForm/Filters/AutoComplete'
    import {filterIDs} from '@/enum/widgetTemplateConfigs'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import OtherFilters from './WidgetUpdateForm/Filters/OtherFilters'
    import {realTimeWidgetRules} from '@/enum/widgetUpdateRules'
    import {settings} from '@/enum/defaultRealTimeWidgetSettings'
    import TimeFrame from './WidgetUpdateForm/WidgetTime/TimeFrame'
    import RealTimeSettings from './WidgetUpdateForm/RealTimeSettings'
    import {widgetTimeOptions, widgetTimeTypes} from '@/enum/widgetTimeOptions'

    export default {
        inheritAttrs: false,
        components: {
            RealTimeSettings,
            TimeFrame,
            [Radio.name]: Radio,
            [Dialog.name]: Dialog,
            [RadioGroup.name]: RadioGroup,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            AutoComplete,
            OtherFilters
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
                    settings: settings,
                    timeInterval: {},
                },
                activeCollapse: ['filters']
            }
        },
        computed: {
            rules() {
                if (isRealtimeWidget(this.widget)) {
                    return realTimeWidgetRules(this.model)
                }
                return {}
            },
            filters() {
                return this.widget.WidgetConfig.filter(c => c.ParameterID && filterIDs.includes(c.ParameterID))
            },
            otherFilters() {
                return this.widget.WidgetConfig.filter(c => c.ParameterID && !filterIDs.includes(c.ParameterID))
            }
        },
        methods: {
            onChange() {
                this.$refs.updateWidget.validate((valid) => {

                    if (!valid) return;

                    if (this.model.WidgetTime.type === 'relative') {
                        let widgetTime = widgetTimeOptions.find((el) => el.label === this.model.WidgetTime.label)
                        this.model.WidgetTime = {
                            ...this.model.WidgetTime,
                            ...widgetTime
                        }
                    } else {
                        this.model.WidgetTime.label = null
                    }

                    this.model.WidgetLayout = {
                        ...this.model.WidgetLayout,
                        ...{settings: this.model.settings}
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
            validateComponentType() {
                return isRealtimeWidget(this.widget)
            }
        },
        mounted() {
            this.model = cloneDeep(this.widget)
            if (isRealtimeWidget(this.widget)) {
                this.model.settings = this.widget.WidgetLayout.settings || settings
            }
        },
    }
</script>
