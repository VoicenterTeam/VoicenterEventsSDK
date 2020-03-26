<template>
    <div class="flex flex-col" v-if="model && model.WidgetLayout">
        <div class="flex flex-row">
            <div class="flex-col">
                <span class="text-main-sm">{{$t('settings.color')}}</span>
                <el-color-picker
                    v-model="model.WidgetLayout['LayoutConfig']['color']"
                    :predefine="predefinedColors"/>
            </div>
            <div class="w-full px-1">
                <div class="flex-col">
                    <span class="text-main-sm">{{$t('settings.fonSize')}}</span>
                    <el-slider
                        :marks="bestOptions"
                        :min="min"
                        :max="max"
                        v-model="model.WidgetLayout['LayoutConfig']['fontSize']">
                    </el-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import uniq from "lodash/uniq";
    import values from "lodash/values";
    import {ColorPicker, Slider} from 'element-ui'
    import {activitiesToDisplay} from '@/enum/queueDashboardStatistics'

    export default {
        components: {
            [Slider.name]: Slider,
            [ColorPicker.name]: ColorPicker,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            predefinedColors() {
                let options = values(this.$store.getters['dashboards/baseColors'])
                return uniq(options)
            },
        },
        data() {
            return {
                activitiesToDisplay,
                min: 4,
                max: 32,
                bestOptions: {
                    16: '16px',
                    20: '20px',
                    24: '24px',
                },
            }
        },
    }
</script>
<style lang="scss" scoped>

</style>
