<template>
    <el-select filterable
               collapse-tags
               :clearable="multiple"
               :multiple="multiple"
               :value="value"
               :loading="loading"
               v-bind="$attrs"
               v-on="listeners">
        <template v-slot:prefix>
            <slot name="prefix"/>
        </template>
        <slot>
            <el-option v-if="multiple && data.length" :label="$t('select.all')" :disabled="allValuesSelected" value="all"/>
            <el-option v-if="multiple && data.length" :label="$t('select.clear')" :disabled="noValueSelected" value="none"/>
            <el-option v-for="(option, key) in data"
                       :key="key"
                       :label="composeLabel(option)"
                       :value="option[valueKey]"/>
        </slot>
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
            value: {
                type: [Array, Object, String, Number],
                default: () => []
            },
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
            secondLabelKey: {
                type: String,
                default: 'second_label'
            },
            valueKey: {
                type: String,
                default: 'value'
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    change: this.onChange
                }
            },
            allValuesSelected() {
                return Array.isArray(this.value) && this.value.length === this.data.length
            },
            noValueSelected() {
                return Array.isArray(this.value) && this.value.length === 0
            }
        },
        methods: {
            composeLabel(option) {
                if (!this.secondLabelKey) {
                    return option[this.labelKey]
                }
                return `${option[this.labelKey]} (${option[this.secondLabelKey]})`
            },
            onChange(value) {
                if (this.multiple && Array.isArray(value)) {
                    if (value.includes('all')) {
                        return this.selectAll()
                    }
                    if (value.includes('none')) {
                        return this.selectNone()
                    }
                }
                this.$emit('change', value);
            },
            selectAll() {
                let value = this.data.map(d => d[this.valueKey])
                this.$nextTick(() => {
                    this.$emit('change', value);
                })
            },
            selectNone() {
                this.$nextTick(() => {
                    this.$emit('change', []);
                })
            }
        },
    }
</script>

<style lang="scss">
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
        color: var(--primary-color) !important;
    }
</style>
