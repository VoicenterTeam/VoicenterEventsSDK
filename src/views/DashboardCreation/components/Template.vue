<template>
    <div class="template-wrapper col-span-3 lg:col-span-1 mb-3 h-64 overflow-auto">
        <div class="h-56 overflow-hidden relative">
            <TemplateWrapper :template="template"/>
        </div>
        <div class="template-footer border-t h-8 flex items-center justify-between px-3 py-1">
            <span class="text-xs text-gray-900">{{ template.DashboardTemplateName }}</span>
            <el-popover placement="top"
                        trigger="hover"
                        :content="$t(template.DashboardTemplateDescription)">
                <IconInfo class="cursor-help hover:text-primary" slot="reference"/>
            </el-popover>
        </div>
    </div>
</template>
<script>
    import { Popover } from 'element-ui'
    import TemplateWrapper from '@/views/DashboardCreation/components/TemplateWrapper'
    
    export default {
        components: {
            TemplateWrapper,
            [Popover.name]: Popover,
        },
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
        },
    }
</script>
<style lang="scss" scoped>
.template-wrapper {
    @apply bg-white rounded shadow-base;
}

</style>

