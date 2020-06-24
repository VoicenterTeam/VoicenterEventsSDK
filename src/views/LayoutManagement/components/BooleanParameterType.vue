<template>
    <div class="py-4 border-b">
        <el-checkbox :checked="valueToBool" v-on="listeners">
            {{$t(LayoutParameterName)}}
        </el-checkbox>
    </div>
</template>
<script>
    import {Checkbox} from 'element-ui'

    export default {
        inheritAttrs: false,
        name: 'Boolean',
        components: {
            [Checkbox.name]: Checkbox,
        },
        props: {
            LayoutParameterName: {
                type: String,
                Default: '',
            },
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    change: this.onChange
                };
            },
            valueToBool() {
                return Boolean(this.$attrs.Value)
            },
        },
        methods: {
            onChange(value) {
                const valToEmit = Number(value).toString()
                this.$emit('input', valToEmit);
            },
        },
    }
</script>
