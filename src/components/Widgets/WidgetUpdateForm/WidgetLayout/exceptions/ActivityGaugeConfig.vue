<template>
    <div class="flex flex-col" v-if="model && model.WidgetLayout">
        <div class="w-full">
            <div class="pb-3">{{$t('queue.activity.to.display')}}</div>
            <base-select
                :data="activitiesToDisplay"
                v-model="model.WidgetLayout.ShowActivities"/>
        </div>
        <div class="w-full pt-5" v-if="displayMainCountSelector">
            <div class="flex">
                <p class="pb-2">{{$t('widget.displayAsMainCount')}}</p>
                <el-popover
                    placement="bottom-start"
                    trigger="hover">
                    {{$t('widget.selectCountBiggerCircle')}}
                    <InfoIcon class="mx-3 text-primary cursor-help w-5" slot="reference"></InfoIcon>
                </el-popover>
            </div>
            <el-radio-group v-model="model.WidgetLayout['mainActivity']">
                <el-radio :label="option.key"
                          :key="option.key"
                          v-bind="option"
                          v-for="option in activitiesToDisplay">
                    {{$t(option.value)}}
                </el-radio>
            </el-radio-group>
        </div>
        <div class="pt-4">
            <div class="pb-3">{{$t('answer.activity.styles')}}</div>
            <div class="flex flex-row">
                <div class="flex-col">
                    <span class="text-main-sm">{{$t('settings.color')}}</span>
                    <el-color-picker
                        :predefine="predefinedColors"
                        v-model="model.WidgetLayout['AnswerCount']['color']"/>
                </div>
                <div class="w-full px-1">
                    <div class="flex-col">
                        <span class="text-main-sm">{{$t('settings.fonSize')}}</span>
                        <el-slider
                            :marks="bestOptions"
                            :max="max"
                            :min="min"
                            v-model="model.WidgetLayout['AnswerCount']['fontSize']">
                        </el-slider>
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-4">
            <div class="pb-3">{{$t('inSLA.activity.styles')}}</div>
            <div class="flex flex-row">
                <div class="flex-col">
                    <span class="text-main-sm">{{$t('settings.color')}}</span>
                    <el-color-picker
                        :predefine="predefinedColors"
                        v-model="model.WidgetLayout['InSLACount']['color']"/>
                </div>
                <div class="w-full px-1">
                    <div class="flex-col">
                        <span class="text-main-sm">{{$t('settings.fonSize')}}</span>
                        <el-slider
                            :marks="bestOptions"
                            :max="max"
                            :min="min"
                            v-model="model.WidgetLayout['InSLACount']['fontSize']">
                        </el-slider>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from "lodash/get"
    import uniq from "lodash/uniq";
    import values from "lodash/values";
    import {InfoIcon} from 'vue-feather-icons'
    import {ColorPicker, Popover, Radio, RadioGroup, Slider} from 'element-ui'
    import {activitiesToDisplay} from '@/enum/queueDashboardStatistics'

    export default {
        components: {
            InfoIcon,
            [Radio.name]: Radio,
            [Slider.name]: Slider,
            [Popover.name]: Popover,
            [RadioGroup.name]: RadioGroup,
            [ColorPicker.name]: ColorPicker,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            predefinedColors () {
                let options = values(this.$store.getters['layout/colors']('activeLayout'))
                return uniq(options)
            },
            displayMainCountSelector () {
                const showActivities = get(this.model, 'WidgetLayout.ShowActivities', [])
                return showActivities.length === activitiesToDisplay.length;
            }
        },
        data () {
            return {
                min: 4,
                max: 32,
                bestOptions: {
                    16: '16px',
                    20: '20px',
                    24: '24px',
                },
                activitiesToDisplay,
            }
        },
    }
</script>
