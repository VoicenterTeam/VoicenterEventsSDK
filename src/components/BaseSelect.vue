<template>
    <el-select filterable
               collapse-tags
               :clearable="multiple"
               :multiple="multiple"
               :loading="loading"
               v-bind="$attrs"
               v-on="listeners">
        <template v-slot:prefix>
            <slot name="prefix"/>
        </template>
        <el-option v-for="(option, key) in data"
                   :key="key"
                   :label="option[labelKey]"
                   :value="option[valueKey]"/>
    </el-select>
</template>

<script>
    import {Option, Select} from 'element-ui'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            labelKey: {
                type: String,
                default: 'label'
            },
            valueKey: {
                type: String,
                default: 'value'
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    change: this.onChange
                }
            },
        },
        methods: {
            onChange(value) {
                this.$emit('change', value);
            },
        },
    }
</script>

<style lang="scss">
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
        color: var(--primary-color) !important;
    }
</style>
