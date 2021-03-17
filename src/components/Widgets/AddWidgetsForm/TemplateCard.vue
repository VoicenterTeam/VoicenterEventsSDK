<template>
    <div class="h-20 border-b flex widget-card items-center justify-between"
         :key="TemplateID">
        <div class="flex items-center">
            <div class="quantity" v-show="quantities[TemplateID]">
                <slot name="quantity"/>
            </div>
            <div v-show="!quantities[TemplateID]">
                <slot name="new-one"/>
            </div>
            <slot name="icon">
                <component class="mx-6 text-primary"
                           :is="getTemplateIcon"/>
            </slot>
            <slot name="title">
                <div class="flex flex-col">
                    <div class="text-main-sm break-normal max-w-90-p">
                        {{ $t(TemplateName) }}
                    </div>
                    <span v-if="activeWidgets"
                          class="text-xs text-steel">
                    {{ $t('Active Widgets') }}: {{ activeWidgets }}
                </span>
                </div>
            </slot>
        </div>
        <slot name="template-preview"/>
    </div>
</template>
<script>
    import { templateIcons } from '@/enum/widgetDataTypes'
    
    export default {
        props: {
            TemplateID: [String, Number],
            Icon: String,
            TemplateName: {
                type: String,
                default: '- -',
            },
            DataType: {
                type: Object,
                default: () => ({
                    DataTypeID: -1,
                }),
            },
            quantities: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            getTemplateIcon() {
                return templateIcons[this.DataType.DataTypeID]
            },
            dashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            dashboardWidgets() {
                let widgets = []
                this.dashboard.WidgetGroupList.forEach(el => {
                    widgets = widgets.concat(el.WidgetList)
                })
                return widgets
            },
            activeWidgets() {
                try {
                    return this.dashboardWidgets.filter(el => el.TemplateID.toString() === this.TemplateID.toString()).length
                } catch (e) {
                    console.warn(e)
                    return 0
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
.quantity ::v-deep {
    .el-input-number--mini {
        @apply w-24;
    }
}
</style>
