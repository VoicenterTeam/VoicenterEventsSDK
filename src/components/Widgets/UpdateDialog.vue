<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="model.title"></el-input>
                </div>
                <div v-if="model.widgetTime && widget.WidgetTime.Date_interval">
                    <time-frame
                        :model="model"
                        :timeFrameType="model.widgetTime.type"
                        :widgetTimeOptions="widgetTimeOptions">
                        <template v-slot:frame-types>
                            <el-radio-group v-model="model.widgetTime.type" class="pb-4">
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
            <filters :data="widget"></filters>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Dialog, Radio, RadioGroup} from 'element-ui'
    import TimeFrame from './WidgetUpdateForm/WidgetTime/TimeFrame'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import {realTimeWidgetRules} from '@/enum/widgetUpdateRules'
    import {widgetTimeOptions, widgetTimeTypes} from '@/enum/widgetTimeOptions'
    import {settings} from '@/enum/defaultRealTimeWidgetSettings'
    import RealTimeSettings from './WidgetUpdateForm/RealTimeSettings'

    import Filters from './WidgetUpdateForm/Filters'

    export default {
        inheritAttrs: false,
        components: {
            RealTimeSettings,
            TimeFrame,
            [Radio.name]: Radio,
            [Dialog.name]: Dialog,
            [RadioGroup.name]: RadioGroup,
            Filters
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
                    title: '',
                    timeInterval: {},
                },
            }
        },
        computed: {
            rules() {
                if (isRealtimeWidget(this.widget)) {
                    return realTimeWidgetRules(this.model)
                }
                return {}
            },
        },
        methods: {
            onChange() {
                this.$refs.updateWidget.validate((valid) => {

                    if (valid) {
                        this.widget.Title = this.model.title;

                        if (this.widget.WidgetTime.Date_interval === 'relative') {
                            if (this.model.widgetTime.label) {
                                let widgetTime = widgetTimeOptions.find((el) => el.label === this.model.widgetTime.label)
                                this.widget.WidgetTime = {
                                    ...this.widget.WidgetTime,
                                    ...widgetTime
                                }
                            } else {
                                this.widget.WidgetTime = this.model.widgetTime
                                delete this.widget.WidgetTime.label
                            }
                        }

                        this.widget.WidgetLayout = {
                            ...this.widget.WidgetLayout,
                            ...{settings: this.model.settings}
                        };

                        this.$emit('on-update', this.widget)
                        this.toggleVisibility(false);
                    }
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
            this.model.title = this.widget.Title
            this.model.widgetTime = this.widget.WidgetTime

            if (isRealtimeWidget(this.widget)) {
                this.model.settings = cloneDeep(this.widget.WidgetLayout.settings || settings)
            }
        },
    }
</script>
