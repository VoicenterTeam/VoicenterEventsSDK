<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange">
            <el-form-item>
                <div>
                    <label>{{$t('widget.title')}}</label>
                    <el-input v-model="widgetTitle"></el-input>
                </div>
                <div v-if="time.Date_interval">
                    <label>{{$t('widget.time.interval')}}</label>
                    <el-select v-model="widgetTimeInterval"
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
    import {Dialog, Select, Option} from 'element-ui'
    import {widgetTimeOptions,} from '@/enum/widgetTimeOptions'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            title: {
                type: String,
                default: () => ''
            },
            time: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                widgetTimeOptions: widgetTimeOptions,
                widgetTitle: '',
                widgetTimeInterval: {}
            }
        },
        mounted() {
            this.widgetTitle = this.title
            this.widgetTimeInterval = get(
                find(this.widgetTimeOptions,
                    {
                        datedeff: parseInt(this.time.datedeff),
                        Date_interval: parseInt(this.time.Date_interval)
                    }
                ), 'label')
        },
        methods: {
            onChange() {
                let widgetTime = widgetTimeOptions.find((el) => el.label === this.widgetTimeInterval)
                let objectToEmit = {
                    WidgetTime: {
                        ...this.time,
                        ...widgetTime
                    },
                    Title: this.widgetTitle
                };
                
                this.$emit('on-change', objectToEmit)
                this.toggleVisibility(false)
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
        },
    }
</script>
