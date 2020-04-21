<template>
    <div>
        <label>{{$t(label)}}</label>
        <el-slider
            class="px-1 pb-5"
            :min="min"
            :max="max"
            :marks="bestOptions"
            v-model="model.WidgetLayout[propToChange]">
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
            model: {
                type: Object,
                default: () => ({}),
            },
            propToChange: {
                type: String,
                default: 'height'
            },
            label: {
                type: String,
                default: 'Widget height'
            }
        },
        data() {
            return {
                value: 0,
                min: 300,
                max: 1500,
                bestOptions: {
                    450: '450',
                    600: '600',
                    900: '900',
                    [fullHeightIdentifier]: 'Full height'
                },
            }
        },
    }
</script>
