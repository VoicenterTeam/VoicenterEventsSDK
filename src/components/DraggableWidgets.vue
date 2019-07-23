<template>
    <draggable class="flex"
               tag="div"
               v-bind="attributes"
               v-on="$listeners">
        <transition-group type="transition" :name="enableTransition ? 'flip-list': ''"
                          class="flex justify-center flex-wrap w-full -mx-2 cursor-move">
            <slot></slot>
        </transition-group>
    </draggable>
</template>
<script>
    import draggable from "vuedraggable";

    export default {
        inheritAttrs: false,
        props: {
            enableTransition: {
                type: Boolean,
                default: true
            }
        },
        components: {
            draggable
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
            attributes() {
                return {
                    ...this.dragOptions,
                    ...this.$attrs,
                }
            }
        }
    }
</script>
<style>
    .flip-list-move {
        transition: transform 0.5s;
    }

    .ghost {
        opacity: 0.3;
        @apply bg-blue-200
        rounded-lg;
    }
</style>
