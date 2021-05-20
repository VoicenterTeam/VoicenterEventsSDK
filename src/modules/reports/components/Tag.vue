<template>
    <span class="tag-label"
          :class="[{
                'active-tag-label' :!disabled,
                'disabled-tag-label' :disabled,
            },
            tagClasses,
          ]"
          :disable-transitions="disableTransitions">
        <span class="flex items-center" :class="innerClass">
            <span v-if="$slots.icon || icon" class="tag-icon" :class="iconClass">
                <slot name="icon">
                    <component :is="icon"></component>
                </slot>
            </span>
            <span :class="contentClasses" :style="contentStyles">
                <slot></slot>
            </span>
        </span>
    </span>
</template>

<script>
    export default {
        name: 'tag',
        props: {
            size: {
                type: String,
                default: 'small',
                description: 'medium | small | mini',
            },
            innerClass: {
                type: String,
                default: '',
            },
            contentClass: {
                type: String,
                default: '',
            },
            iconClass: {
                type: String,
                default: '',
            },
            icon: {
                type: String,
                default: '',
            },
            showClose: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            disableTransitions: {
                type: Boolean,
                default: false,
            },
            tagClass: {
                type: String,
                default: '',
            },
            limitWith: {
                type: [Number, String],
                default: '',
            },
        },
        computed: {
            tagClasses() {
                let classes = []
                if (!this.tagClass) {
                    classes.push('tag-default')
                } else {
                    classes.push(this.tagClass)
                }

                classes.push(this.getSizeClass())

                if (this.$rtl.isRTL) {
                    classes.push('mr-2')
                } else {
                    classes.push('ml-2')
                }
                return classes.join(' ')
            },
            contentClasses() {
                let classes = []
                if (this.contentClass) {
                    classes.push(this.contentClass)
                } else {
                    classes.push('flex items-center')
                }
                if (this.limitWith) {
                    classes.push('truncate')
                }
                return classes
            },
            contentStyles() {
                let styles = {}
                if (this.limitWith) {
                    styles['max-width'] = parseInt(this.limitWith) + 'px'
                }
                return styles
            },
        },
        methods: {
            getSizeClass() {
                const classMap = {
                    mini: 'tag-size-xs',
                    medium: 'tag-size-md',
                    default: 'tag-size-sm',
                }
                return classMap[this.size] || classMap.default
            },
        },
    }
</script>

<style scoped lang="scss">
.tag-label {
    @apply text-sm mx-1 bg-white inline-flex items-center border text-gray-950;
    color: #263148 !important;

    &.tag-default {
        @apply mb-0;
    }

    &.tag-size-xs {
        @apply h-4 px-2;
        border-radius: 8px;
        line-height: 14px;
    }

    &.tag-size-sm {
        @apply h-6 px-3;
        border-radius: 12px;
        line-height: 22px;
    }

    &.tag-size-md {
        @apply h-8 px-2 block;
        border-radius: 16px;
        line-height: 30px;
    }

    &.active-tag-label {
        @apply text-gray-100 border-primary;
    }

    &.disabled-tag-label {
        @apply text-gray-600 border-gray-500;
    }
}

.tag-icon {
    @apply text-primary w-4 mr-2;
}

.tag-close {
    @apply w-2 ml-4 cursor-pointer;
}
</style>
