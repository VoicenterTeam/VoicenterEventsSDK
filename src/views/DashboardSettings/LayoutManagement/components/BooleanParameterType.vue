<template>
    <div class="py-4 border-b checkbox">
        <el-checkbox :checked="valueToBool" @change="onChange">
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
            valueToBool() {
                return this.$attrs.Value === "1";
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

<style lang="scss" scoped>
.checkbox::v-deep .el-checkbox__inner {
    border-width: 2px;
    width: 18px;
    height: 18px;

    &::after {
        height: 10px;
        top: -1px;
        left: 5px;
        border-width: 2px;
    }
}
</style>
