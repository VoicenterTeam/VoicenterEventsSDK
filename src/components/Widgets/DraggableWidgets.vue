<template>
    <draggable class="flex -mx-2"
               tag="div"
               v-bind="attributes"
               v-on="$listeners">
        <transition-group type="transition" :name="enableTransition ? 'flip-list': ''"
                          class="flex justify-center flex-wrap w-full"
                          :class="{'cursor-move': !dragOptions.disabled }">
            <slot></slot>
        </transition-group>
    </draggable>
</template>
<script>
    import draggable from "vuedraggable";
    import bus from '@/event-bus/EventBus'

    export default {
        inheritAttrs: false,
        props: {
            enableTransition: {
                type: Boolean,
                default: true
            },
            disabled: Boolean
        },
        components: {
            draggable
        },
        data() {
            return {
                dragDisabled: false
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    fallbackTolerance: 10,
                    direction: 'horizontal',
                    group: "description",
                    disabled: this.disabled || this.dragDisabled,
                    ghostClass: "ghost"
                };
            },
            attributes() {
                return {
                    ...this.dragOptions,
                    ...this.$attrs,
                }
            }
        },
        mounted() {
            bus.$on('sortable.childDragStart', () => {
                this.dragDisabled = true
            })
            bus.$on('sortable.childDragStop', () => {
                this.dragDisabled = false
            })
        }
    }
</script>
<style>
    .flip-list-move {
        transition: transform 0.5s;
    }

    .ghost {
        opacity: 0.3;
        @apply bg-blue-200 rounded-lg;
    }
</style>
