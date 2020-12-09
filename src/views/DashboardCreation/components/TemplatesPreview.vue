<template>
    <div class="flex-1 relative bg-gray-150 p-4 rounded">
        <div class="px-3 flex flex-row items-center justify-between text-main-base font-medium mb-4">
            <span class="">{{ dashboardCategory.DashboardTemplateCategoryDescription }}</span>
            <div class="text-primary hover:text-primary-200 cursor-pointer flex items-center"
                 @click="onSubmit">
                <IconPlus class="w-3 h-3 mx-1"/>
                {{ $t('Create blank dashboard') }}
            </div>
        </div>
        <div class="overflow-auto wrapper-style">
            <div class="template grid grid-cols-3 col-gap-3">
                <Template v-for="(template, index) in dashboardCategory.DashboardTemplateList"
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
    import Template from '@/views/DashboardCreation/components/Template'
    
    export default {
        components: {
            Template,
        },
        props: {
            dashboardCategory: {
                type: Object,
                default: () => ({}),
            },
        },
        methods: {
            onSubmit() {
                this.$emit('on-submit')
            },
        },
    }
</script>
<style lang="scss" scoped>
.wrapper-style {
    height: calc(100vh - 450px);
}
</style>
