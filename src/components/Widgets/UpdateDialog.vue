<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="model.title"></el-input>
                </div>
                <div v-if="widget.WidgetTime.Date_interval">
                    <label>{{$t('widget.time.interval')}}</label>
                    <el-select v-model="model.timeInterval"
                               placeholder="Select"
                               class="w-full pt-2">
                        <el-option
                            v-for="(item, index) of widgetTimeOptions"
                            :key="index"
                            :label="$t(item.label)"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <Real-time-settings
                v-if="validateComponentType(widget)"
                :data="widget"
                :model="model">
            </Real-time-settings>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import get from 'lodash/get'
    import find from 'lodash/find'
    import cloneDeep from 'lodash/cloneDeep'
    import {Dialog, Select, Option} from 'element-ui'
    import {isRealtimeWidget} from '@/helpers/widgetUtils'
    import {realTimeWidgetRules} from '@/enum/widgetUpdateRules'
    import {widgetTimeOptions} from '@/enum/widgetTimeOptions'
    import {settings} from '@/enum/defaultRealTimeWidgetSettings'
    import RealTimeSettings from './WidgetUpdateForm/RealTimeSettings'


    export default {
        inheritAttrs: false,
        components: {
            RealTimeSettings,
            [Dialog.name]: Dialog,
            [Select.name]: Select,
            [Option.name]: Option,
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

                        if (this.widget.WidgetTime.Date_interval) {

                            let widgetTime = widgetTimeOptions.find((el) => el.label === this.model.timeInterval)
                            this.widget.WidgetTime = {
                                ...this.widget.WidgetTime,
                                ...widgetTime
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
            this.model.timeInterval = get(
                find(this.widgetTimeOptions,
                    {
                        datedeff: parseInt(get(this.widget.WidgetTime, 'datedeff')),
                        Date_interval: parseInt(get(this.widget.WidgetTime, 'Date_interval'))
                    }
                ), 'label')
            if (isRealtimeWidget(this.widget)) {
                this.model.settings = cloneDeep(this.widget.WidgetLayout.settings || settings)
            }
        },
    }
</script>
