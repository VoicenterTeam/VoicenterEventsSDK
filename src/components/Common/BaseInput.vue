<template>
    <div
        class="form-group relative"
        :class="{
          'input-group-focus': focused,
          'input-hover': isInputHovered,
          'has-danger': (error || !vError.disabled && vError.errorMsg),
          /*'has-success': (!error && vError.disabled && !vError.errorMsg) && touched && value,*/
          'has-label': (label || name) && !hideLabel
        }"
    >
        <div class="mb-0 flex"
             :class="{'input-group': hasIcon , 'flex-col': !inlineContent}"
             @mouseover="onInputHover"
             @mouseleave="onInputHover(false)">
            <div class="input-label-wrapper" :class="{'mb-2': !hideLabel && (name || label) && !inlineContent}">
                <slot name="label">
                    <label v-if="!hideLabel && (name || label)" class="input-label">
                        <span v-if="$slots.labelIcon || labelIcon" class="label-left-icon mr-2">
                            <slot name="labelIcon">
                                <i :class="[labelIcon, labelIconClass ? labelIconClass : 'label-icon']" class="text-icons" />
                            </slot>
                        </span>
                        <span v-if="!emptyLabel" class="label-text" :class="inputLabelClass">{{ label || name}}
                            <span v-if="required"
                                  class="required-label-icon"
                                  :class="{'hide-icon': !required}">*</span>
                        </span>
                        <div class="flex items-center mx-2" v-if="showTooltip">
                            <el-tooltip popper-class="input-info-tooltip"
                                        placement="top"
                                        effect="light">
                                <div slot="content">{{tooltip}}</div>
                                <i class="vc-help text-primary icon-base"/>
                            </el-tooltip>
                        </div>
                    </label>
                </slot>

                <div class="inline-flex items-center justify-between">
                    <div v-if="showCopyBtn">
                        <base-button type="primary" link size="sm" icon="vc-copy"
                                     class="copy-btn-temp"
                                     name="copy"
                                     data-test-name="copy"
                                     :class="isInputHovered ? 'opacity-100' : 'opacity-50'"
                                     @click="handleCopy">
                            {{$t('general.copy')}}
                        </base-button>
                    </div>
                    <div v-if="$attrs.type === 'password' && showPassword">
                        <base-button type="primary" link size="sm"
                                     class="copy-btn-temp"
                                     name="copy"
                                     data-test-name="copy"
                                     :class="isInputHovered ? 'opacity-100' : 'opacity-50'"
                                     @click="togglePasswordVisibility">
                            <template v-slot:icon>
                                <i :class="isPasswordShow ? 'vc-blind' : 'vc-eye'"
                                   class="text-primary mr-1 icon-base"/>
                            </template>
                            {{ isPasswordShow ? $t('general.password.hide') : $t('general.password.show')}}
                        </base-button>
                    </div>
                    <div v-if="showClearBtn">
                        <base-button type="primary" link size="sm" icon-size="sm" icon="vc-clear"
                                     class="copy-btn-temp"
                                     name="copy"
                                     data-test-name="copy"
                                     :class="isInputHovered ? 'opacity-100' : 'opacity-50'"
                                     @click="handleClear">
                            {{$t('general.clear')}}
                        </base-button>
                    </div>
                    <template v-if="showDisableBtn">
                        <base-switch v-model="isEnabled"
                                     label-type="enabled"
                                     class="text-sm"
                                     :data-test-name="dataTestName"
                                     @change="toggleSwitch"
                                     :switch-reverse-view="$attrs['switch-reverse-view']" />
                    </template>
                    <slot name="label-button" :class="isInputHovered ? 'opacity-100' : 'opacity-50'"></slot>
                </div>
            </div>
            <slot name="addonLeft">
                <span v-if="addonLeftIcon" class="input-group-prepend">
                    <div class="input-group-text"><i :class="addonLeftIcon"/></div>
                </span>
            </slot>
            <div class="input-body" :class="inputWrapperClasses">
                <component :is="isTooltip ? 'el-popover' : 'div'"
                           popper-class="is-danger"
                           effect="danger"
                           trigger="manual"
                           :content="vError.errorMsg"
                           :value="!vError.disabled"
                           :disabled="vError.disabled"
                           placement="top"
                           :tabindex="-1">
                    <div :slot="isTooltip ? 'reference' : ''">
                        <slot :disabled="inputDisabled">
                            <template v-if="fieldType !== 'textarea'">
                                <div class="relative w-full">
                                    <slot name="input-before"></slot>
                                    <div class="input-element-wrapper w-full"
                                         :class="{'disabled': inputDisabled,
                                                  'placeholder-mode': !value,
                                                  'disabled-mode': value && inputDisabled}">
                                        <div class="input-icon" v-if="$slots['input-icon'] || inputIcon">
                                            <div class="min-w-4 flex items-center" :class="inputIconClass">
                                                <slot name="input-icon">
                                                    <i :class="[inputIcon, inputIconClass]"
                                                       class="min-w-4 icon-base text-primary"/>
                                                </slot>
                                            </div>
                                        </div>
                                        <input
                                            ref="inputElement"
                                            :autocomplete="$attrs.useAutocomplete ? '' : 'new-password'"
                                            :value="value"
                                            :name="name"
                                            :placeholder="$attrs.placeholder"
                                            :disabled="inputDisabled"
                                            :data-test="`input-${dataTestName}`"
                                            v-bind="$attrs"
                                            v-on="listeners"
                                            class="form-control w-full"
                                            :class="inputComputedClasses"
                                            aria-describedby="addon-right addon-left"
                                        />
                                    </div>
                                    <span class="suffix-icon mt-3 md:mt-2" v-if="$slots['input-suffix-icon'] || inputSuffixIcon">
                                        <div class="min-w-4" :class="inputIconClass"  @click="$emit('icon-press')">
                                            <slot name="input-suffix-icon">
                                                <i :class="[inputSuffixIcon, inputIconClass]"
                                                   class="icon-base text-gray-600"/>
                                            </slot>
                                        </div>
                                    </span>
                                    <slot name="input-after"></slot>
                                </div>
                            </template>
                            <div v-else
                                 class="textarea-element-wrapper">
                                <el-input
                                    type="textarea"
                                    :value="value"
                                    v-bind="$attrs"
                                    v-on="listeners"
                                    :autosize="autosizeParams"
                                    :resize="resize"
                                    :data-test="`input-textarea-${dataTestName}`"
                                    placeholder="Please input"
                                    class="form-control textarea"
                                    aria-describedby="addon-right addon-left">
                                </el-input>
                            </div>
                        </slot>
                    </div>
                </component>
            </div>
        </div>

        <div class="input-error-wrapper" v-if="errorType === 'label' && !hideError">
            <slot name="error" v-show="(error || $slots.error)">
                <el-tooltip v-model="showErrorTooltip"
                            effect="danger"
                            popper-class="is-light-danger"
                            :disabled="!isTruncated"
                            :tabindex="-1">
                    <div slot="content">{{ error }}</div>
                    <label class="error" :data-test="`${dataTestName}-error-message`" tabindex="-1" v-ellipsis-check>{{ error }}</label>
                </el-tooltip>
            </slot>
        </div>

        <slot name="addonRight">
            <span v-if="addonRightIcon" class="input-group-append">
                <div class="input-group-text"><i :class="addonRightIcon"/></div>
            </span>
        </slot>
        <slot name="helperText"/>
    </div>
</template>

<script>

export default {
    inheritAttrs: false,
    name: 'base-input',
    props: {
        fieldType: {
            type: String,
            default: 'text'
        },
        required: Boolean,
        hideLabel: Boolean,
        emptyLabel: Boolean,
        labelHint: {
            type: String,
            description: ''
        },
        label: {
            type: String,
            description: 'Input label'
        },
        labelIcon: {
            type: String,
            description: 'Input label icon',
            default: ''
        },
        labelIconClass: {
            type: String,
            default: ''
        },
        inputIcon: {
            type: String,
            description: 'Input icon',
            default: ''
        },
        inputSuffixIcon: {
            type: String,
            description: 'Input icon',
            default: ''
        },
        error: {
            type: String,
            default: '',
            description: 'Input error',
        },
        errorType: {
            type: String,
            default: 'label',
            description: 'Error type (tooltip || label)'
        },
        hideError: {
            type: Boolean,
            default: false
        },
        inlineContent: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
        },
        showTooltip: {
            type: Boolean,
            default: false
        },
        tooltip: {
            type: String,
            default: ''
        },
        inputIconClass: {
            type: String,
            default: ''
        },
        inputLabelClass: {
            type: String,
            default: ''
        },
        showCopyBtn: {
            type: Boolean,
            default: false
        },
        showClearBtn: {
            type: Boolean,
            default: false
        },
        showDisableBtn: {
            type: Boolean,
            default: false
        },
        switchValue: {
            type: Boolean,
            default: false
        },
        showPassword: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            description: 'Input name',
            default: ''
        },
        dataTestName: {
            type: String,
            default: 'default'
        },
        value: {
            type: [String, Number],
            description: 'Input value'
        },
        addonRightIcon: {
            type: String,
            description: 'Input icon on the right'
        },
        addonLeftIcon: {
            type: String,
            description: 'Input icon on the left'
        },
        inputWrapperClasses: {
            type: [Object, String],
            default: ''
        },
        inputClasses: {
            type: [Object, String],
            default: ''
        },
        autoSize: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        minRows: {
            type: [Number, String],
            default: 1
        },
        maxRows: {
            type: [Number, String],
            default: 4
        },
        resize: {
            type: String,
            default: 'none',
            description: 'none|both|horizontal|vertical'
        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    data() {
        return {
            focused: false,
            touched: false,
            isPasswordShow: false,
            isInputHovered: false,
            isEnabled: false,
            isTruncated: false,
            showErrorTooltip: false,
        };
    },
    watch: {
        switchValue: {
            handler(newV) {
                if(newV !== this.isEnabled) {
                    this.isEnabled = newV
                }
            },
            immediate: true
        }
    },
    computed: {
        autosizeParams() {
            if(!this.autoSize) {
                return false
            }
            return { minRows: this.minRows, maxRows: this.maxRows}
        },
        hasIcon() {
            const {addonRight, addonLeft} = this.$slots;
            return (
                addonRight !== undefined ||
                addonLeft !== undefined ||
                this.addonRightIcon !== undefined ||
                this.addonLeftIcon !== undefined
            );
        },
        listeners() {
            return {
                ...this.$listeners,
                input: this.onInput,
                blur: this.onBlur,
                focus: this.onFocus
            };
        },
        vError() {
            const name = this.$attrs['data-vv-name'] ? this.$attrs['data-vv-name'] : this.name
            const error = this.errors ? this.errors.items.find(item => item.field === name) : false
            return {
                errorMsg: this.errors && this.errors.items.length && error ? error.msg : '',
                disabled: !error
            }
        },
        isTooltip() {
            return this.inline || this.errorType === 'tooltip' && !this.hideError
        },
        inputComputedClasses() {
            return [
                this.inputClasses,
                this.size ? `size-${this.size}` : '',
                this.$slots['input-icon'] || this.inputIcon ? 'input-with-icon' : ''
            ]
        },
        inputDisabled() {
            return this.disabled || this.showDisableBtn && !this.isEnabled
        }
    },
    methods: {
        togglePasswordVisibility() {
            const inputElement = this.$refs.inputElement;

            if (!inputElement) {
                return;
            }

            this.isPasswordShow = inputElement.type === 'password';

            inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
        },
        onInput(evt) {
            if (!this.touched) {
                this.touched = true;
            }
            if(this.fieldType === 'textarea') {
                this.$emit('input', evt);
                return false
            }
            this.$emit('input', evt.target.value);
        },
        onFocus(event) {
            this.focused = true;

            this.$emit('focus', event)
        },
        onBlur() {
            this.focused = false;
        },
        onInputHover(state = true) {
            this.isInputHovered = state
        },
        setInputFocus() {
            if(this.$refs.inputElement){
                this.$refs.inputElement.focus()
            }

        },
        handleCopy() {
            const el = document.createElement('textarea');
            el.value = this.value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            this.$notify({
                type: 'primary', icon: true,
                title: this.$t('general.notify.copy.success')
            })
        },
        handleClear() {
            this.$emit('input', null);
            this.$emit('clear')
        },
        toggleSwitch(value) {
            this.$emit('toggle-switch', value)
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/assets/css/_common.scss";

.rtl {
    .form-group ::v-deep {
        .password-icon {
            @apply right-0 ml-0;
            left: unset;
            margin-right: 5px;
        }
    }
    .suffix-icon{
        @apply absolute top-0 -mr-6;
    }
}

.input-group-focus {
    .input-element-wrapper,
    .textarea-element-wrapper {
        @apply border-primary;

        &:after {
            opacity: 1;
        }
    }
}

.input-hover {
    .input-element-wrapper,
    .textarea-element-wrapper {
        @apply shadow-base;

        &:after {
            opacity: 1;
        }
    }
}

.input-element-wrapper input {
    @apply font-normal;
}

.input-element-wrapper,
.textarea-element-wrapper {
    @apply transition-all duration-300 ease-in relative bg-white;

    &:after {
        @apply transition-all duration-300 ease-in relative;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
    }
}

.suffix-icon{
    @apply absolute top-0 -ml-6;
}

::v-deep .el-input__icon {
    @apply leading-8;
}

.input-element-wrapper,
.textarea-element-wrapper,
::v-deep .search-input .el-input__inner,
::v-deep .custom-input .el-input__inner,
::v-deep .el-date-editor .el-input__inner {
    @apply w-full border border-gray-border rounded inline-flex overflow-hidden;
}

.input-element-wrapper,
::v-deep .search-input .el-input__inner,
::v-deep .custom-input .el-input__inner,
::v-deep .el-date-editor .el-input__inner {
    @apply h-10;

    @screen md{
        @apply h-8;
    }
}

.input-element-wrapper {
    @apply h-10;

    @screen md{
        @apply h-8;
    }

    .form-control,
    .el-input__inner {
        @apply text-default-text text-sm h-full border-0 px-3;

        &.input-with-icon {
            @apply pl-1;
        }

        &::placeholder {
            @apply text-gray text-sm;
        }
    }

    .input-icon {
        @apply inline-flex items-center text-center pl-3;
    }


    &:focus {
        @apply border-primary;
        outline: 0;
    }

    &.placeholder-mode {
        @apply text-gray;
    }

    &.disabled-mode {
        @apply text-gray;

        .form-control,
        .el-input__inner {
            @apply text-gray;
        }
    }
}

.input-element-wrapper.disabled,
.form-control[disabled], .form-control[readonly] {
    @apply bg-gray-100 cursor-not-allowed;
}

.textarea {
    @apply w-full p-0 min-h-8;

    ::v-deep .el-textarea__inner {
        @apply text-sm leading-tight h-auto border-0;
        padding: 8px 15px 7px;
    }
}

.input-body {
    & * {
        outline-style: none;
    }

    .el-tooltip {
        @apply w-full;
    }
}

.input-label-wrapper {
    @apply w-full inline-flex items-center justify-between;

    .label-left-icon {
        @apply inline-flex items-center;
    }

    .label-text {
        @apply relative mr-4;
    }

    .required-label-icon {
        @extend .base-transition;
        @apply text-primary absolute -right-2 top-0;

        &.hide-icon {
            @apply opacity-0;
        }
    }
}

.has-success {
    ::v-deep .input-element-wrapper {
        @apply border-green;
    }

    .form-control:focus {
        @apply border-primary;
    }
}

.has-danger {
    ::v-deep .input-element-wrapper,
    .form-control,
    ::v-deep .el-input input,
    ::v-deep .select-primary .el-select .el-input input {
        @apply border-red;
    }
}

::v-deep .el-input--prefix .el-input__inner {
    padding-left: 34px;
}

/* temporary */
.copy-btn-temp {
    font-size: 11px;
    min-width: auto;
}
</style>
