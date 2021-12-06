<template>
    <draggable class="flex-mx-2"
               tag="div"
               v-bind="attributes"
               v-on="$listeners">
        <transition-group type="transition" :name="enableTransition ? 'flip-list': ''"
                          class="flex justify-center flex-wrap w-full"
                          :class="{'cursor-grabbing': !dragOptions.disabled }">
            <slot></slot>
        </transition-group>
    </draggable>
</template>
<script>
    import draggable from 'vuedraggable'

    export default {
        inheritAttrs: false,
        props: {
            enableTransition: {
                type: Boolean,
                default: true,
            },
            disabled: Boolean,
        },
        components: {
            draggable,
        },
        data() {
            return {
                dragDisabled: false,
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    fallbackTolerance: 10,
                    direction: 'horizontal',
                    group: 'description',
                    disabled: this.disabled || this.dragDisabled,
                    ghostClass: 'ghost',
                }
            },
            attributes() {
                return {
                    ...this.dragOptions,
                    ...this.$attrs,
                }
            },
        },
    }
</script>
<style lang="scss">
    .flip-list-move {
        transition: transform 0.5s;
    }

    .ghost {
        @apply border border-primary bg-primary-50 rounded-lg opacity-25;
        opacity: 0.3;
    }
</style>
