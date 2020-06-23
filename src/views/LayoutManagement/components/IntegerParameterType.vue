<template>
    <div class="pt-3 pb-5 border-b">
        <label>{{$t(LayoutParameterName)}}</label>
        <el-slider
            v-bind="sliderOptionConfigs[LayoutParameterName]"
            v-on="listeners"
            :value="valueToInt"
            show-input>
        </el-slider>
    </div>
</template>
<script>
    import {Slider} from 'element-ui'
    import {sliderOptionConfigs} from '../layout-management-config'

    export default {
        name: 'Integer',
        components: {
            [Slider.name]: Slider,
        },
        props: {
            Value: {
                type: String,
                Default: '',
            },
            LayoutParameterName: {
                type: String,
                Default: '',
            },
        },
        data() {
            return {
                sliderOptionConfigs,
                valueToInt: Number(this.Value)
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput
                };
            }
        },
        methods: {
            onInput(value) {
                const valToEmit = value.toString()
                this.$emit('input', valToEmit);
            }
        }
    }
</script>
