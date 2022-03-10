<template>
    <div class="template-wrapper col-span-3 lg:col-span-1 mb-3 overflow-hidden"
        :class="{'selected': template.DashboardTemplateID === selectedTemplate.DashboardTemplateID}"
        @click="onSelectTemplate(template)">
        <div class="template-preview-image overflow-hidden relative border border-gray-550 rounded">
            <TemplateWrapper :template="template"/>
        </div>
        <div class="divider-horizontal-line" />
        <div
            class="template-footer flex items-center justify-between pt-3"
            @click.stop="onDetailedView(template)"
        >
            <span class="text-base text-gray-950">{{ template.DashboardTemplateName }}</span>
            <el-popover
                placement="top"
                trigger="hover"
                :content="$t(template.DashboardTemplateTitle)"
            >
                <IconInfo class="cursor-help text-primary" slot="reference"/>
            </el-popover>
        </div>
    </div>
</template>
<script>
    import { Popover } from 'element-ui'

    export default {
        inheritAttrs: false,
        components: {
            TemplateWrapper: () => import('@/views/DashboardCreation/components/TemplateWrapper'),
            [Popover.name]: Popover
        },
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
            selectedTemplate: [Object, Boolean],
        },
        methods: {
            onDetailedView(template) {
                this.$emit('on-detailed-view', template)
            },
            onSelectTemplate(template) {
                this.$emit('on-select-template', template)
            },
        },
    }
</script>
<style lang="scss" scoped>
.template-wrapper {
    @apply bg-white shadow-base border rounded-md cursor-pointer p-3;
}
.selected {
    @apply border border-primary;
}
.divider-horizontal-line {
    @apply border border-gray-300 -mx-3 mt-3;
}
.template-preview-image {
    width: 280px;
    height: 180px;
}
</style>

