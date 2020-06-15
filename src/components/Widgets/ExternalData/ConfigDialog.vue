<template>
    <modal v-bind="$attrs" v-on="$listeners">
        <div class="flex flex-row items-center">
            <h3 slot="title" class="text-main-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
            <static-widget-info class="px-2" :widget="widget"/>
        </div>
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model"
                 v-if="model.WidgetLayout">
            <el-form-item>
                <label>{{$t('widget.title')}}</label>
                <el-input v-model="model.Title"/>
            </el-form-item>
            <el-form-item>
                <label>{{$t('Widget external endpoint')}}</label>
                <el-input v-model="model.WidgetLayout.Endpoint"/>
            </el-form-item>
            <el-form-item>
                <label>{{$t('Widget type')}}</label>
                <el-select v-model="model.WidgetLayout.ComponentTypeID"
                           placeholder="Select"
                           @change="triggerChange"
                           class="w-full pt-2">
                    <el-option
                        v-for="(item, index) of options"
                        :key="index"
                        v-bind="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="model && isPieWidget(model)">
                <el-checkbox v-model="model.WidgetLayout.hideLoggedOutUsers" class="pt-4">
                    {{$t('Don`t count logged out agents')}}
                </el-checkbox>
            </el-form-item>
            <br>
            <el-alert
                v-if="model.WidgetLayout.ComponentTypeID"
                class="mt-12"
                v-html="dictionary[model.WidgetLayout.ComponentTypeID]"
                type="info"
                :closable="false"
                show-icon>
            </el-alert>
            <el-collapse v-model="activeCollapse" class="pt-4">
                <el-collapse-item :title="$t('widget.layout')" name="layout">
                    <el-form-item>
                        <widget-padding :model="model"/>
                    </el-form-item>
                    <widget-colors :model="model"/>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </modal>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Alert, Checkbox, Collapse, CollapseItem, Option, Select} from 'element-ui'
    import Modal from "@/components/Common/Modal";
    import {isPieWidget} from '@/helpers/widgetUtils'
    import {dictionary, options, dummyDataEndpoints} from '@/enum/externalDataWidgetConfig'
    import WidgetColors from '../WidgetUpdateForm/WidgetLayout/WidgetColors'
    import WidgetPadding from '../WidgetUpdateForm/WidgetLayout/WidgetPadding'
    import StaticWidgetInfo from '../WidgetUpdateForm/StaticWidgetInfo'

    export default {
        components: {
            [Checkbox.name]: Checkbox,
            [Select.name]: Select,
            [Option.name]: Option,
            [Alert.name]: Alert,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            Modal,
            WidgetColors,
            WidgetPadding,
            StaticWidgetInfo
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                model: {},
                options,
                dictionary,
                activeCollapse: ['layout'],
                dummyDataEndpoints,
            }
        },
        computed: {
            rules() {
                return {}
            },
        },
        methods: {
            isPieWidget,
            onChange() {
                if (this.widget.WidgetLayout.Endpoint !== this.model.WidgetLayout.Endpoint ||
                    this.widget.WidgetLayout.ComponentTypeID !== this.model.WidgetLayout.ComponentTypeID) {
                    this.$confirm(
                        this.$t('common.confirm.question', {
                            action: this.$t('to update widget'),
                        }), this.$t('widget.update'), {
                            cancelButtonText: this.$t('common.cancel'),
                            confirmButtonText: this.$t('common.confirm'),
                        }).then(() => {
                        this.storeData()
                    })
                } else {
                    this.storeData()
                }
            },
            storeData() {
                this.model.WidgetLayout = {
                    ...this.model.WidgetLayout,
                    ...{colors: this.model.colors},
                }
                this.$emit('on-update', this.model)
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
            triggerChange() {
                let endpoint = this.dummyDataEndpoints[this.model.WidgetLayout.ComponentTypeID]
                this.$set(this.model.WidgetLayout, 'Endpoint', endpoint)
            },
        },
        mounted() {
            this.model = cloneDeep(this.widget)
        }
    }
</script>
