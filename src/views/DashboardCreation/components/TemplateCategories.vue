<template>
    <div class="w-64">
        <div v-for="category in categories"
             @click="onChooseCategory(category)"
             class="w-full h-12 p-4 flex items-center category-wrapper mb-2 mx-1 hover:text-primary cursor-pointer"
             :class="category.DashboardTemplateCategoryID == selectedCategoryID ? 'text-primary border border-primary': 'text-steel'">
            <component :is="fillCategoryIcon(category)"
                       class="w-4 h-4"/>
            <span class="mx-2 truncate">
                {{ $t(category.DashboardTemplateCategoryName) }}
            </span>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Template from '@/views/DashboardCreation/components/Template'
    
    export default {
        components: {
            Template,
        },
        props: {
            categories: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                selectedCategoryID: null,
            }
        },
        methods: {
            fillCategoryIcon(category) {
                const words = category.DashboardTemplateCategoryName.split(' ');
                return `Icon${words[0]}`
            },
            onChooseCategory(category) {
                this.selectedCategoryID = category.DashboardTemplateCategoryID
                this.$emit('on-choose-category', category)
            },
        },
        watch: {
            categories: {
                immediate: true,
                handler(options) {
                    this.$nextTick(() => {
                        this.onChooseCategory(options[0])
                    })
                },
            },
        },
    }
</script>
<style lang="scss" scoped>
.category-wrapper {
    @apply rounded shadow-base;
}
</style>
