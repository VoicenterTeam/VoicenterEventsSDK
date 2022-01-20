<template>
    <div class="flex-1 relative bg-gray-150 p-4 rounded">
        <div class="px-3 flex flex-row items-center justify-between text-main-base font-medium mb-4">
            <span class="">{{ dashboardCategory.DashboardTemplateCategoryDescription }}</span>
            <button class="create-blank-dashboard text-primary cursor-pointer flex items-center font-medium"
                @click="onSubmit" :disabled="disableCreateBlankBtn">
                <IconPlus class="w-3 h-3 mx-1"/>
                {{ $t('dashboard.createBlankDashboard') }}
            </button>
        </div>
        <div class="overflow-auto wrapper-style">
            <div class="template grid grid-cols-3 gap-3">
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
    import WidgetTemplate from '@/views/DashboardCreation/components/Template'

    export default {
        components: {
            WidgetTemplate,
        },
        props: {
            dashboardCategory: {
                type: Object,
                default: () => ({}),
            },
            disableCreateBlankBtn: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onSubmit() {
                this.$emit('on-submit', true)
            },
        },
    }
</script>
<style lang="scss" scoped>
.wrapper-style {
    height: calc(100vh - 450px);
}
button[disabled] {
    @apply opacity-50 cursor-not-allowed;
}
button:not([disabled]):hover {
    @apply text-primary-200;
}
</style>
