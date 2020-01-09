<template>
    <div>
        <label>{{$t('Widget padding')}}</label>
        <el-slider
        class="px-1"
        v-model="model.WidgetLayout.padding"
        show-input>
    </el-slider>
    </div>
</template>

<script>
    import {Slider} from 'element-ui'

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
    }
</script>
