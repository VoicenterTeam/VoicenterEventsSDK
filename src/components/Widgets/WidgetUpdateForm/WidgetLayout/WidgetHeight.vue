<template>
    <div>
        <label>{{$t('Widget height')}}</label>
        <el-slider
            class="px-1 pb-5"
            :step="step"
            :min="min"
            :max="max"
            :marks="bestOptions"
            v-model="model.WidgetLayout.height">
        </el-slider>
    </div>
</template>
<script>
    import {Slider} from 'element-ui'
    import {fullHeightIdentifier} from '@/enum/defaultWidgetSettings'

    export default {
        components: {
            [Slider.name]: Slider,
        },
        props: {
            model: Object,
            default: () => ({})
        },
        data() {
            return {
                value: 0,
                step: 10,
                min: 150,
                max: 1500,
                bestOptions: {
                    300: '300',
                    500: '500',
                    900: '900',
                    [fullHeightIdentifier]: 'Full height'
                },
            }
        },
    }
</script>
