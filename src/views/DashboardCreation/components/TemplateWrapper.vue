<template>
    <div class="relative">
        <LayoutPreview
            :have-preview="false"
            :fixed-zoom="fixedZoom"
        >
            <WidgetList :widget-group="widgetGroup"
                        :editable="editable"
                        :widgets="widgets"
            />
        </LayoutPreview>
    </div>
</template>
<script>
    import WidgetList from '@/components/Widgets/WidgetList'
    import LayoutPreview from '@/views/LayoutSettings/LayoutPreview'
    
    export default {
        components: {
            WidgetList,
            LayoutPreview,
        },
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            widgets() {
                return this.template.WidgetTemplateList.map((widget, index) => ({
                    ...widget,
                    WidgetID: index,
                    TemplateID: widget.WidgetTemplateID,
                }))
            },
            widgetGroup() {
                return {
                    WidgetGroupID: this.template.DashboardTemplateCategoryID,
                }
            },
        },
        data() {
            return {
                editable: false,
                fixedZoom: 0.3,
            }
        },
    }
</script>
<style lang="scss" scoped>
.template-wrapper {
}
</style>
