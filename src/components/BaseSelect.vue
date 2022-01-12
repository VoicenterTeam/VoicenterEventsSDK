<template>
    <div>
        <div class="select-label" v-if="$slots && $slots.label">
            <slot name="label" />
        </div>
        <div>
            <el-select :filterable="filterable"
                :collapse-tags="collapseTags"
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
                <el-option v-if="multiple && data.length" :label="$t('select.all')" :disabled="allValuesSelected"
                        value="all"/>
                <el-option v-if="multiple && data.length" :label="$t('select.clear')" :disabled="noValueSelected"
                        value="none"/>
                <el-option v-for="(option, key) in data"
                        :key="key"
                        :label="composeLabel(option)"
                        :value="option[valueKey]">
                    <div class="flex items-center"
                        :key="key">
                        <component
                            v-if="option.icon"
                            :is="option.icon"
                            class="text-primary w-4 h-4"
                            :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"
                        />
                        {{ composeLabel(option) }}
                    </div>
                </el-option>
            </slot>
        </el-select>
        </div>
    </div>
</template>

<script>
    import { Option, Select } from 'element-ui'
    
    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            collapseTags: {
                type: Boolean,
                default: true,
            },
            filterable: {
                type: Boolean,
                default: true,
            },
            value: {
                type: [Array, Object, String, Number],
                default: () => [],
            },
            data: {
                type: Array,
                default: () => [],
            },
            multiple: {
                type: Boolean,
                default: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            labelKey: {
                type: String,
                default: 'label',
            },
            secondLabelKey: {
                type: String,
                default: '',
            },
            valueKey: {
                type: String,
                default: 'value',
            },
        },
        model: {
            prop: 'value',
            event: 'change',
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    change: this.onChange,
                }
            },
            allValuesSelected() {
                return Array.isArray(this.value) && this.value.length === this.data.length
            },
            noValueSelected() {
                return Array.isArray(this.value) && this.value.length === 0
            },
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
            },
        },
    }
</script>

<style lang="scss">
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: var(--primary-color) !important;
}
.select-label {
    @apply text-gray-950 text-sm mb-2 font-semibold;
}
::v-deep .el-select .el-input .el-select__caret {
    @apply text-primary font-bold;
}
</style>
