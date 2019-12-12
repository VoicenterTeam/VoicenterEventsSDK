<template>
    <div>
        <el-color-picker
            :value="value"
            v-bind="$attrs"
            v-on="listeners"/>
    </div>
</template>
<script>
    import {ColorPicker} from 'element-ui'

    export default {
        inheritAttrs: false,
        props: {
            value: {
                type: [String, Number],
                default: '#FFFFFF'
            }
        },
        components: {
            [ColorPicker.name]: ColorPicker,
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onChange
                };
            }
        },
        methods: {
            onChange(val) {
                this.$emit('input', val);
            }
        }
    }
</script>
