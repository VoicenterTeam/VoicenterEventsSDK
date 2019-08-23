<template>
    <div class="flex items-center layout-types__switcher -mx-1">
        <div class="flex mr-4">
            <p class="text-sm font-normal">View type</p>
        </div>
        <div>
            <button class="btn shadow rounded bg-white mx-1 text-gray-300"
                    @click="switching('tabbed')"
                    :disabled="editMode"
                    :class="{'text-primary': activeType === 'tabbed', 'cursor-not-allowed': editMode}">
                <IconTabbedView></IconTabbedView>
            </button>
            <button class="btn shadow rounded bg-white mx-1 text-gray-300"
                    @click="switching('normal')"
                    :class="{'text-primary': activeType === 'normal'}">
                <IconNormalView></IconNormalView>
            </button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'layout-switcher',
        inheritAttrs: false,
        components: {},
        props: {
            editMode: {
                type: Boolean,
                default: false
            },
            activeType: {
                type: String,
                default: 'normal'
            }
        },
        methods: {
            switching(type) {
                this.$emit('switch-layout', type)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .layout-types__switcher {
        color: var(--greyish-brown);
        font-size: 12px;
    }

    .rtl .layout-types__switcher div:first-child {
        margin-right: 0;
        @apply ml-4;
    }

</style>

