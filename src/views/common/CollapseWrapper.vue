<template>
    <div class="collapse-wrapper"
         v-bind="$attrs">
        <div class="header w-full hover:text-primary flex items-center px-6"
             @click="onTriggerCollapse">
            <div class="flex items-center">
                <component v-if="icon"
                           class="text-primary"
                           :is="icon"/>
                <div :class="icon ? 'mx-4' : 'mx-auto'">
                    <span :class="{'text-primary': expanded}">
                        {{ $t(title) }}
                    </span>
                </div>
            </div>
            <IconShape class="text-gray-900 hover:text-primary"
                       :class="expanded ? 'is-expanded text-primary': 'is-collapsed'"/>
        </div>
        <collapse-transition :duration="250">
            <div class="content"
                 v-show="expanded">
                <div class="px-6 w-full">
                    <slot>

                    </slot>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            icon: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                expanded: false,
            }
        },
        methods: {
            onTriggerCollapse() {
                this.expanded = !this.expanded
            },
        },
    }
</script>
<style lang="scss" scoped>
.collapse-wrapper ::v-deep {
    @apply shadow-base flex w-full flex-col;
    .header {
        @apply h-16 border-b border-gray-300 flex flex-row justify-between cursor-pointer;
    }

    .content {
        @apply flex w-full;
    }

    .is-expanded {
        transition: all 0.3s ease-in;
        transform: rotate(-90deg);
    }

    .is-collapsed {
        transition: all 0.3s ease-in;
        transform: rotate(90deg);
    }
}
</style>
