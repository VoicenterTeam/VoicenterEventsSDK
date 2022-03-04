<template>
    <div class="flex-1 relative bg-gray-150 px-3 pb-3 pt-4 rounded">
        <div class="overflow-auto wrapper-style">
            <div class="template grid grid-cols-3 gap-5">
                <WidgetTemplate v-for="(template, index) in dashboardCategory.DashboardTemplateList"
                    :key="`template-${index}`"
                    v-on="$listeners"
                    v-bind="$attrs"
                    :template="template"
                />
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        components: {
            WidgetTemplate: () => import('@/views/DashboardCreation/components/Template')
        },
        props: {
            dashboardCategory: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>
<style lang="scss" scoped>
.wrapper-style {
    min-height: 450px;
}
button[disabled] {
    @apply opacity-50 cursor-not-allowed;
}
button:not([disabled]):hover {
    @apply text-primary-200;
}
</style>
