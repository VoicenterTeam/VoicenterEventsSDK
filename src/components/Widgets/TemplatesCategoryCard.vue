<template>
    <div class="py-2 bg-white flex items-center">
        <div class="flex items-center widget-card w-full py-2 px-2 cursor-pointer" @click="onSelectCategory">
            <slot name="icon">
                <component class="w-7 mx-1 text-primary" :is="CategoryImage"></component>
            </slot>
            <slot name="title">
                <p class="text-sm mx-2 caption">
                    {{CategoryName}}
                </p>
            </slot>
            <slot name="state-icon"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            CategoryImage: String,
            CategoryName: {
                type: String,
                default: '- -'
            },
            templatesCategory: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            onSelectCategory() {
                this.$emit('on-select', this.templatesCategory)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .caption {
        color: var(--dark);
    }

    .widget-card {
        border: solid 1px var(--silver-color);
    }

    .w-7 {
        width: 1.6rem;
    }
</style>
