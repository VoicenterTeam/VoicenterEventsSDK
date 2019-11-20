<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.extension')" name="threshold">
        <el-form @submit.native.prevent="onUpdate" :rules="rules" ref="cardSettings" :model="settings">
                <div class="flex flex-col">
                    <div class="md:flex md:flex-col md:justify-center my-4">
                        <el-checkbox v-model="settings.showLoggedOutUsers">
                            {{$t('settings.extension.logout')}}
                        </el-checkbox>
                    </div>
                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.threshold.generalThreshold">
                            {{$t('settings.set.threshold')}}
                        </el-checkbox>
                        <el-form-item prop="threshold.generalThresholdLowValue" class="my-2">
                            {{$t('settings.set.threshold.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.generalThreshold"
                                             v-model.number="settings.threshold.generalThresholdLowValue"></el-input-number>
                            <span class="p-2">{{$t('settings.switch.interval')}}</span>
                        </el-form-item>
                        <el-form-item prop="threshold.generalThresholdHeightValue" class="my-2">
                            {{$t('settings.set.threshold.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.generalThreshold"
                                             v-model.number="settings.threshold.generalThresholdHeightValue"></el-input-number>
                            <span class="p-2">{{$t('settings.switch.interval')}}</span>
                        </el-form-item>
                    </div>
                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.threshold.callThreshold">
                            {{$t('settings.set.threshold.call')}}
                        </el-checkbox>
                        <el-form-item prop="threshold.callThresholdLowValue" class="my-2">
                            {{$t('settings.set.threshold.call.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.callThreshold"
                                             v-model.number="settings.threshold.callThresholdLowValue"></el-input-number>
                        </el-form-item>
                        <el-form-item prop="threshold.callThresholdHeightValue" class="my-2">
                            {{$t('settings.set.threshold.call.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.threshold.callThreshold"
                                             v-model.number="settings.threshold.callThresholdHeightValue"></el-input-number>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Checkbox, ColorPicker, InputNumber, Collapse, CollapseItem} from 'element-ui'

    export default {
        components: {
            [Collapse.name]: Collapse,
            [Checkbox.name]: Checkbox,
            [InputNumber.name]: InputNumber,
            [ColorPicker.name]: ColorPicker,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            settings: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                activeCollapse: ['threshold'],
            }
        },
        computed: {
            rules() {
                return {
                    'threshold.generalThresholdLowValue': [
                        {
                            min: this.settings.threshold.generalThreshold ? 1 : 0,
                            type: 'number',
                            message: this.$t('validation.generalThresholdLowValue'),
                        }
                    ],
                    'threshold.generalThresholdHeightValue': [
                        {
                            min: this.settings.threshold.generalThreshold ? (this.settings.threshold.generalThresholdLowValue + 1) : 0,
                            type: 'number',
                            message: this.$t('validation.generalThresholdHeightValue'),
                        }
                    ],
                    'threshold.callThresholdLowValue': [
                        {
                            min: this.settings.threshold.callThreshold ? 1 : 0,
                            type: 'number',
                            message: this.$t('validation.callThresholdLowValue'),
                        }
                    ],
                    'threshold.callThresholdHeightValue': [
                        {
                            min: this.settings.threshold.callThreshold ? (this.settings.threshold.callThresholdLowValue + 1) : 0,
                            type: 'number',
                            message: this.$t('validation.callThresholdHeightValue'),
                        }
                    ],
                }
            }
        },
        methods: {
            onUpdate() {
                debugger
            }
        },
    }
</script>
<style lang="scss" scoped>

</style>
