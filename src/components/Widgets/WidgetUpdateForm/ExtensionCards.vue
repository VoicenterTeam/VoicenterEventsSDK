<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.extension')" name="threshold">
        <el-form :rules="rules" ref="cardSettings" :model="settings">
                <div class="flex flex-col">
                    <div class="md:flex md:flex-col md:justify-center my-4">
                        <el-checkbox v-model="settings.showLoggedOutUsers">
                            {{$t('settings.extension.logout')}}
                        </el-checkbox>
                    </div>
                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.generalThreshold">
                            {{$t('settings.set.threshold')}}
                        </el-checkbox>
                        <el-form-item prop="generalThresholdLowValue" class="my-2">
                            {{$t('settings.set.threshold.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.generalThreshold"
                                             v-model.number="settings.generalThresholdLowValue"></el-input-number>
                            <span class="p-2">{{$t('settings.switch.interval')}}</span>
                        </el-form-item>
                        <el-form-item prop="generalThresholdHeightValue" class="my-2">
                            {{$t('settings.set.threshold.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.generalThreshold"
                                             v-model.number="settings.generalThresholdHeightValue"></el-input-number>
                            <span class="p-2">{{$t('settings.switch.interval')}}</span>
                        </el-form-item>
                    </div>

                    <div class="md:flex md:flex-col md:justify-center mt-4">
                        <el-checkbox v-model="settings.callThreshold">
                            {{$t('settings.set.threshold.call')}}
                        </el-checkbox>
                        <el-form-item prop="callThresholdLowValue" class="my-2">
                            {{$t('settings.set.threshold.call.low')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.callThreshold"
                                             v-model="settings.callThresholdLowValue"></el-input-number>
                        </el-form-item>
                        <el-form-item prop="callThresholdHeightValue" class="my-2">
                            {{$t('settings.set.threshold.call.height')}}
                            <el-input-number class="mx-2 w-36" size="small" :min="0"
                                             :disabled="!settings.callThreshold"
                                             v-model.number="settings.callThresholdHeightValue"></el-input-number>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    // import cloneDeep from 'lodash/cloneDeep'
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
                // settings: cloneDeep(this.settings)
            }
        },
        computed: {
            rules() {
                return {
                    'generalThresholdLowValue': [
                        {
                            min: this.settings.generalThreshold ? 1 : 0,
                            type: 'number',
                            message: this.$t('validation.generalThresholdLowValue'),
                        }
                    ],
                    'generalThresholdHeightValue': [
                        {
                            min: this.settings.generalThreshold ? (this.settings.generalThresholdLowValue + 1) : 0,
                            type: 'number',
                            message: this.$t('validation.generalThresholdHeightValue'),
                        }
                    ],
                    'callThresholdLowValue': [
                        {
                            min: this.settings.callThreshold ? 1 : 0,
                            type: 'number',
                            message: this.$t('validation.callThresholdLowValue'),
                        }
                    ],
                    'callThresholdHeightValue': [
                        {
                            min: this.settings.callThreshold ? (this.settings.callThresholdLowValue + 1) : 0,
                            type: 'number',
                            message: this.$t('validation.callThresholdHeightValue'),
                        }
                    ],
                }
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
