<template>
    <span :class="{
             'rounded': !rounded,
             'rounded-full': rounded,
             'block w-full': block,
             'inline-flex': !block,
             'shadow-sm': !variant.includes('link')
          }"
    >
        <button :type="$attrs.type || 'button'"
                :disabled="disabled || loading"
                v-on="$listeners"
                ref="button"
                class="items-center justify-center border-2 border-transparent font-medium focus:outline-none focus:ring-blue transition ease-in-out duration-50 relative"
                :class="[{
                  'rounded': !rounded,
                  'rounded-full': rounded,
                  'text-white bg-primary hover:bg-primary-200 focus:border-primary-700 active:bg-primary-200': variant === 'primary',
                  'text-primary-600 hover:text-primary-900': variant === 'primary-link',
                  'text-green-600 hover:text-green-900': variant === 'green-link',
                  'text-gray-600 hover:text-gray-900': variant === 'gray-link',
                  'text-white bg-red-600 hover:bg-red-500 focus:border-red-700 active:bg-red-700': variant === 'danger',
                  'text-red-600 hover:bg-red-200 hover:text-red-700': variant === 'danger-link',
                  'text-primary-700 bg-primary-100 hover:bg-primary-50 focus:border-primary-300 active:bg-primary-200': variant === 'secondary',
                  'text-red-700 border-red-300 hover:bg-red-50 focus:border-red-300 active:bg-red-400': variant === 'danger-secondary',
                  'border-gray-550 border-2 text-gray-550 bg-white hover:text-primary hover:border-primary focus:primary focus:shadow-outline-blue active:text-primary active:bg-primary-100': variant === 'white',
                  'border-gray-550 text-gray-550 bg-white hover:bg-gray-200 focus:bg-gray-400': variant === 'discard',
                  'text-xs px-2.5 py-1-5 leading-4': size === 'xs',
                  'text-sm px-3 py-1-5 leading-4': size === 'sm',
                  'text-sm px-4 py-1-5 leading-4': size === 'md',
                  'text-base px-6 py-2 leading-6': size === 'lg',
                  'text-base px-8 py-3 leading-6': size === 'xl',
                  'p-0 leading-0': size === 'full',
                  'opacity-50 cursor-not-allowed': disabled || localLoading,
                  'inline-flex': !block,
                  'w-full flex justify-center': block,
                }, fixedWidth ? `${fixedWidth}`: '']"
                v-bind="$attrs"
        >
        <div v-if="localLoading"
             class="absolute flex w-full items-center justify-center">
            <loader-icon class="spin-animation"
                         :class="{
                           'h-4 w-4': size === 'xs',
                           'h-5 w-5': size === 'sm',
                           'h-5 w-5': !['xs', 'sm'].includes(size),
                         }"/>
        </div>

        <div class="flex flex-wrap"
             :class="{'opacity-0': localLoading}"
        >
            <slot></slot>
        </div>
    </button>
    </span>
</template>
<script>
    import { LoaderIcon } from 'vue-feather-icons'

    export default {
        inheritAttrs: false,
        components: {
            LoaderIcon,
        },
        props: {
            block: {
                type: Boolean,
                default: false,
            },
            rounded: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            variant: {
                type: String,
                default: 'primary', // primary|secondary|danger|danger-secondary|white/discard
            },
            size: {
                type: String,
                default: 'md', // xs|sm|md|lg|xl
            },
            fixedWidth: String,
        },
        data() {
            return {
                localLoading: false,
            }
        },
        methods: {
            focus() {
                if (!this.$refs.button) {
                    return
                }
                this.$refs.button.focus()
            },
        },
        watch: {
            loading: {
                immediate: true,
                handler(value) {
                    if (!value) {
                        this.localLoading = false
                        return
                    }
                    setTimeout(() => {
                        if (this.loading) {
                            this.localLoading = true
                        }
                    }, 200)
                },
            },
        },
    }
</script>
