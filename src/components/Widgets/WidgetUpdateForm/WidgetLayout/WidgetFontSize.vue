<template>
    <div>
        <label>{{$t('widget.font.size')}}</label>
        <el-slider
            class="px-1"
            :min="min"
            :max="max"
            v-model="model.WidgetLayout.fontSize"
            show-input>
        </el-slider>
    </div>
</template>
<script>

    import {Slider} from 'element-ui'

    const fontSizes = {
        MIN: 10,
        MAX: 32
    }

    export default {
        components: {
            [Slider.name]: Slider
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                min: fontSizes.MIN,
                max: fontSizes.MAX,
            }
        }
    }
</script>
