<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="title"></el-input>
                </div>
                <div v-if="widget.WidgetTime.Date_interval">
                    <label>{{$t('widget.time.interval')}}</label>
                    <el-select v-model="timeInterval"
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
            <component
                :is="widget.componentType"
                :data="widget"
                :settings="settings">
            </component>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import ExtensionCards from './WidgetUpdateForm/ExtensionCards'
    import get from 'lodash/get'
    import find from 'lodash/find'
    import {Dialog, Select, Option} from 'element-ui'
    import {widgetTimeOptions,} from '@/enum/widgetTimeOptions'

    export default {
        inheritAttrs: false,
        components: {
            ExtensionCards,
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
                title: '',
                timeInterval: {},
                settings: cloneDeep(this.$store.state.dashboards.settings),
                widgetTimeOptions: widgetTimeOptions,
            }
        },
        methods: {
            onChange() {
                this.widget.Title = this.title;

                if (this.widget.WidgetTime.Date_interval) {
                    let widgetTime = widgetTimeOptions.find((el) => el.label === this.timeInterval)
                    this.widget.WidgetTime = {
                        ...this.widget.WidgetTime,
                        ...widgetTime
                    }
                }
                this.$emit('on-update', this.widget);

                if (this.widget.componentType === 'ExtensionCards') {
                    this.$emit('onUpdateSettings', this.settings)
                }

                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
        },
        mounted() {
            this.title = this.widget.Title
            this.timeInterval = get(
                find(this.widgetTimeOptions,
                    {
                        datedeff: parseInt(get(this.widget.WidgetTime, 'datedeff')),
                        Date_interval: parseInt(get(this.widget.WidgetTime, 'Date_interval'))
                    }
                ), 'label')
        },
    }
</script>
