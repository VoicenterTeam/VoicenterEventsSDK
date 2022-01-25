<template>
<div class="pt-3 pb-5 border-b slider">
    <label>{{ $t(LayoutParameterName) }}</label>
    <el-slider
        v-bind="sliderOptionConfigs[LayoutParameterName]"
        v-on="listeners"
        :value="valueToInt"
        :show-input="showInput"
    />
</div>
</template>
<script>
import { Slider } from 'element-ui'
import { sliderOptionConfigs } from '../layout-management'

export default {
    inheritAttrs: false,
    name: 'Integer',
    components: {
        [Slider.name]: Slider,
    },
    props: {
        LayoutParameterName: {
            type: String,
            Default: '',
        },
        showInput: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            sliderOptionConfigs,
        }
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners,
                input: this.onInput,
            };
        },
        valueToInt() {
            return Number(this.$attrs.Value)
        },
    },
    methods: {
        onInput(value) {
            const valToEmit = value.toString()
            this.$emit('input', valToEmit);
        },
    },
}
</script>

<style lang="scss" scoped>
.slider::v-deep {
    .el-slider__marks-text {
        font-size: 12px;
        margin-top: 10px;
    }
    .el-slider__button {
        width: 10px;
        height: 10px;
        border-width: 1px;
    }
}
</style>
