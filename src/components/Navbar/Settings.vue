<template>
    <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true">
        <h3 slot="title" class="text-xl font-medium text-gray-700">{{$t('settings.update.title')}}</h3>
        <el-collapse v-model="activeCollapses">
            <el-collapse-item :title="$t('settings.reports')" name="report">
                <el-form @submit.native.prevent="updateSettings">
                    <div class="md:flex md:items-center">
                        {{$t('settings.switch.title')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="5"
                                  v-model.number="settings.report.interval"></el-input-number>
                        {{$t('settings.switch.interval')}}
                    </div>
                    <div class="md:flex md:items-center mt-4">
                        <el-checkbox v-model="settings.report.switching">
                            {{$t('settings.category.switching')}}
                        </el-checkbox>
                    </div>
                    <div class="md:flex md:items-center mt-4">
                        <el-checkbox v-model="settings.report.refresh">{{$t('settings.category.refresh')}}
                        </el-checkbox>
                    </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item :title="$t('settings.colors')" name="color">
                <div class="flex">
                    <el-color-picker v-model="settings.colors.primary"></el-color-picker>
                    <span class="p-2">{{$t('settings.color.primary')}}</span>
                    <el-color-picker v-model="settings.colors.secondary"></el-color-picker>
                    <span class="p-2">{{$t('settings.color.secondary')}}</span>
                </div>
            </el-collapse-item>
            <el-collapse-item :title="$t('settings.threshold')" name="threshold">
                <div class="flex flex-col">
                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.threshold.generalThreshold">
                            {{$t('settings.set.threshold')}}
                        </el-checkbox>
                        <div class="my-2">
                            {{$t('settings.set.threshold.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.generalThreshold"
                                             v-model.number="settings.threshold.generalThresholdLowValue"></el-input-number>
                            <span class="p-2">{{$t('settings.color.secondary')}}</span>
                        </div>
                        <div class="my-2">
                            {{$t('settings.set.threshold.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.generalThreshold"
                                             v-model.number="settings.threshold.generalThresholdHeightValue"></el-input-number>
                            <span class="p-2">{{$t('settings.color.secondary')}}</span>
                        </div>
                    </div>
                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.threshold.callThreshold">
                            {{$t('settings.set.threshold.call')}}
                        </el-checkbox>
                        <div class="my-2">
                            {{$t('settings.set.threshold.call.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.callThreshold"
                                             v-model.number="settings.threshold.callThresholdLowValue"></el-input-number>
                        </div>
                        <div class="my-2">
                            {{$t('settings.set.threshold.call.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.callThreshold"
                                             v-model.number="settings.threshold.callThresholdHeightValue"></el-input-number>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <template slot="footer">
            <el-button plain @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button plain type="primary" @click="updateSettings">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog, Checkbox, Collapse, CollapseItem, ColorPicker, InputNumber} from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'

    export default {
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [InputNumber.name]: InputNumber,
            [Checkbox.name]: Checkbox,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [ColorPicker.name]: ColorPicker,
        },
        data() {
            return {
                settings: cloneDeep(this.$store.state.settings),
                activeCollapses: ['report', 'color', 'threshold'],
            }
        },
        methods: {
            updateSettings() {
                this.$store.dispatch('settings/update', this.settings)
                this.toggleVisibility(false)
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
        },
    }
</script>
<style lang="scss">
    .w-24 {
        width: 6rem !important;
        padding: 0 10px;
    }

    .rtl .el-checkbox__inner {
        margin-left: 10px;
    }

    .rtl .el-color-svpanel {
        float: right;
    }

    .el-checkbox__input.is-checked {
        + .el-checkbox__label {
            color: var(--greyish-brown) !important;
        }
        .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: var(--primary-color) !important;
            border-color: var(--primary-color) !important;
        }
    }

</style>
