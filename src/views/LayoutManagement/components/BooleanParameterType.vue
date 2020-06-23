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
        name: 'Boolean',
        components: {
            [Checkbox.name]: Checkbox,
        },
        props: {
            // Value: {
            //     type: String,
            //     Default: '',
            // },
            LayoutParameterName: {
                type: String,
                Default: '',
            },
        },
        data() {
            return {
                valueToBool: Boolean(this.$attrs.Value)
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
                const state  = Number(value).toString()
                this.$emit('input', state);
            }
        },
        mounted() {
            console.log('$attrs', this.$attrs)
        }
    }
</script>
