<template>
    <validation-provider :rules="$attrs.rules"
                         :name="$attrs.name || label"
                         v-slot="{ errors }">
        <div>
            <label :for="$attrs.id"
                   class="flex items-center mb-2">
                <component v-if="labelIcon"
                           :is="labelIcon"
                           class="text-primary mb-0-5"/>
                <span class="mx-1 text-main-sm text-gray-950"
                      v-html="label">
                </span>
                <span v-if="$attrs.rules && $attrs.rules.includes('required')"
                      class="text-gray-500">
                      *
                </span>
            </label>
            <slot name="container"
                  :errors="errors">
                <div class="relative rounded-md base-input">
                    <base-input-error :errors="errors">
                        <input v-bind="$attrs"
                               :value="value"
                               :type="type"
                               :name="$attrs.name || label"
                               @focus="onFocus"
                               @blur="onBlur"
                               v-on="listeners"
                               :class="{
                                'form-input-error': errors.length,
                                'bg-gray-100 cursor-not-allowed': $attrs.disabled,
                                'cursor-not-allowed bg-gray-100 focus:shadow-none focus:border-transparent': $attrs.readonly !== undefined,
                               }"
                               class="block w-full sm:text-sm sm:leading-5 el-input__inner"/>
                    </base-input-error>
                    <div v-if="error"
                         class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </slot>
        </div>
    </validation-provider>
</template>
<script>
    import { XCircleIcon, HelpCircleIcon } from 'vue-feather-icons'
    import BaseInputError from '@/modules/common/components/form/BaseInputError'
    
    export default {
        components: {
            XCircleIcon,
            HelpCircleIcon,
            BaseInputError,
        },
        inheritAttrs: false,
        props: {
            value: {
                type: [String, Number, Date],
                default: '',
            },
            type: {
                type: [String, Number],
                default: 'text',
            },
            label: {
                type: String,
                default: '',
            },
            labelIcon: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                error: '',
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput,
                }
            },
        },
        methods: {
            onFocus() {
                if (this.type !== 'number') return
                if (parseFloat(this.value) === 0) {
                    this.$emit('input', '')
                }
            },
            onBlur() {
                if (this.type !== 'number') return
                if (this.value === '') {
                    this.$emit('input', 0)
                }
            },
            onInput(evt) {
                this.$emit('input', evt.target.value)
            },
        },
    }
</script>
<style lang="scss">
.base-input-errors {
    input.form-input-error.el-input__inner {
        border: 1px solid var(--red) !important;
    }
}
</style>
