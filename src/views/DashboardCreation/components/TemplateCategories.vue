<template>
    <div class="xl:w-48 flex flex-row lg:flex-col">
        <div
            v-for="category in categories"
            @click="onChooseCategory(category)"
            class="w-full h-12 p-4 flex items-center category-wrapper mb-2 mx-1 text-primary cursor-pointer"
            :class="{ 'border border-primary': category.DashboardTemplateCategoryID === selectedCategoryID }"
            :key="category.DashboardTemplateCategoryID">
            <component :is="fillCategoryIcon(category)"
                       class="w-4 h-4 text-primary"/>
            <el-tooltip :content="$t(category.DashboardTemplateCategoryName)"
                        :open-delay="200"
                        placement="top">
                <span
                    class="mx-2 truncate"
                    :class="category.DashboardTemplateCategoryID === selectedCategoryID ? 'text-black': 'text-steel'"
                >
                    {{ $t(category.DashboardTemplateCategoryName) }}
                </span>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'
    import Template from '@/views/DashboardCreation/components/Template'

    export default {
        components: {
            Template,
            [Tooltip.name]: Tooltip,
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
                    if (!options[0]) {
                        return
                    }
                    this.$nextTick(() => {
                        this.onChooseCategory(options[0])
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.category-wrapper {
    @apply rounded shadow-base;
}
</style>
