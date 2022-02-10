<template>
    <modal v-bind="$attrs" v-on="$listeners">
        <template v-slot:title>
            <div class="flex flex-row items-center">
                <h3 class="text-main-2xl font-semibold text-gray-700">{{ $t('widget.update') }}</h3>
                <static-widget-info class="px-2" :widget="widget"/>
            </div>
        </template>
        <el-form @submit.native.prevent="onChange"
                 :model="model"
                 class="py-6"
                 v-if="model.WidgetLayout">
            <el-form-item>
                <label>{{ $t('widget.title') }}</label>
                <el-input v-model="model.Title"/>
            </el-form-item>
            <el-form-item v-if="'DefaultRefreshInterval' in model">
                <WidgetRefreshInterval :model="model"/>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('widget.widgetExternalEndpoint') }}</label>
                <el-input v-model="model.WidgetLayout.Endpoint"/>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('widget.widgetType') }}</label>
                <el-select v-model="model.WidgetLayout.ComponentTypeID"
                           placeholder="Select"
                           class="w-full pt-2">
                    <el-option
                        v-for="(item, index) of options"
                        :key="index"
                        v-bind="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-collapse v-if="model.WidgetLayout.ComponentTypeID"
                         v-model="activeCollapse">
                <el-collapse-item :title="$t('widget.dictionary')" name="dictionary">
                    <json-viewer
                        :value="dictionary[model.WidgetLayout.ComponentTypeID]"
                        :expand-depth=5
                        copyable
                        boxed
                        sort></json-viewer>
                </el-collapse-item>
            </el-collapse>
            <el-collapse v-model="activeCollapse" class="pt-2">
                <el-collapse-item :title="$t('widget.layout')" name="layout">
                    <el-form-item>
                        <widget-padding :model="model"/>
                    </el-form-item>
                    <widget-colors :model="model"/>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template slot="footer">
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
    import { Alert, Checkbox, Collapse, CollapseItem, Option, Select } from 'element-ui'
    import Modal from '@/components/Common/Modal';
    import { isPieWidget } from '@/helpers/widgetUtils'
    import { dictionary, options } from '@/enum/externalDataWidgetConfig'
    import WidgetColors from '../WidgetUpdateForm/WidgetLayout/WidgetColors'
    import WidgetPadding from '../WidgetUpdateForm/WidgetLayout/WidgetPadding'
    import StaticWidgetInfo from '../WidgetUpdateForm/StaticWidgetInfo'
    import JsonViewer from 'vue-json-viewer'
    import WidgetRefreshInterval from '@/components/Widgets/WidgetUpdateForm/WidgetLayout/WidgetRefreshInterval'
    import CancelButton from "@/components/Common/Buttons/CancelButton";
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton";

    export default {
        components: {
            [Checkbox.name]: Checkbox,
            [Select.name]: Select,
            [Option.name]: Option,
            [Alert.name]: Alert,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            Modal,
            JsonViewer,
            WidgetColors,
            WidgetPadding,
            StaticWidgetInfo,
            WidgetRefreshInterval,
            CancelButton,
            ConfirmButton,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                model: {},
                options,
                dictionary,
                activeCollapse: ['layout'],
            }
        },
        methods: {
            isPieWidget,
            onChange() {
                if (this.widget.WidgetLayout.Endpoint !== this.model.WidgetLayout.Endpoint ||
                    this.widget.WidgetLayout.ComponentTypeID !== this.model.WidgetLayout.ComponentTypeID) {
                    this.$confirm(
                        this.$t('common.confirm.question', {
                            action: this.$t('config.toUpdateWidget'),
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
                    ...{ colors: this.model.colors },
                }
                this.$emit('on-update', this.model)
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
        },
        mounted() {
            this.model = cloneDeep(this.widget)
        },
    }
</script>
