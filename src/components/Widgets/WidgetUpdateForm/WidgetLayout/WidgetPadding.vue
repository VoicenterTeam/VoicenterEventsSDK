<template>
    <div>
        <label>{{$t('Widget padding')}}</label>
        <el-slider
            class="px-1"
            :class="$rtl.isRTL ? 'pr-2' : 'pl-2'"
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
