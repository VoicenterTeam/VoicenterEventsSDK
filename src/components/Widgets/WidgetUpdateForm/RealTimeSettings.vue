<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.extension')" name="threshold">
            <div class="flex flex-col">
                <div class="md:flex md:flex-col md:justify-center my-4">
                    <el-checkbox v-model="model.settings.showLoggedOutUsers">
                        {{$t('settings.extension.logout')}}
                    </el-checkbox>
                </div>
                <div class="md:flex md:flex-col md:justify-center mt-4">
                    <el-checkbox v-model="model.settings.generalThreshold">
                        {{$t('settings.set.threshold')}}
                    </el-checkbox>
                    <el-form-item prop="settings.generalThresholdLowValue" class="my-2">
                        {{$t('settings.set.threshold.low')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="0"
                                         :disabled="!model.settings.generalThreshold"
                                         v-model.number="model.settings.generalThresholdLowValue"></el-input-number>
                        <span class="p-2">{{$t('settings.switch.interval')}}</span>
                    </el-form-item>
                    <el-form-item prop="settings.generalThresholdHeightValue" class="my-2">
                        {{$t('settings.set.threshold.height')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="0"
                                         :disabled="!model.settings.generalThreshold"
                                         v-model.number="model.settings.generalThresholdHeightValue"></el-input-number>
                        <span class="p-2">{{$t('settings.switch.interval')}}</span>
                    </el-form-item>
                </div>

                <div class="md:flex md:flex-col md:justify-center mt-4">
                    <el-checkbox v-model="model.settings.callThreshold">
                        {{$t('settings.set.threshold.call')}}
                    </el-checkbox>
                    <el-form-item prop="settings.callThresholdLowValue" class="my-2">
                        {{$t('settings.set.threshold.call.low')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="0"
                                         :disabled="!model.settings.callThreshold"
                                         v-model="model.settings.callThresholdLowValue"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="settings.callThresholdHeightValue" class="my-2">
                        {{$t('settings.set.threshold.call.height')}}
                        <el-input-number class="mx-2 w-36" size="small" :min="0"
                                         :disabled="!model.settings.callThreshold"
                                         v-model.number="model.settings.callThresholdHeightValue"></el-input-number>
                    </el-form-item>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
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
            model: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                activeCollapse: ['threshold'],
            }
        },
    }
</script>
