<template>
    <div class="h-20 border-b flex widget-card items-center justify-between w-full"
         :key="WidgetID">
        <div class="flex items-center w-full pl-8">
            <slot name="icon">
                <component class="mx-6 text-primary"
                           :is="'IconSettings'"
                />
            </slot>
            <slot name="title">
                <div class="flex flex-col">
                    <div class="text-xl text-gray-950 break-normal">
                        {{ $t(WidgetName) }}
                    </div>
                    <span
                        v-if="activeWidgets"
                        class="text-xs text-steel">
                    {{ $t('widget.activeWidgets') }}: {{ activeWidgets }}
                </span>
                </div>
            </slot>
        </div>
        <div class="mr-6-5">
            <slot name="template-preview"/>
        </div>
    </div>
</template>
<script>
import { templateIcons } from '@/enum/widgetDataTypes'

export default {
    props: {
        WidgetID: [String, Number],
        Icon: String,
        WidgetName: {
            type: String,
            default: '- -',
        },
        quantities: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
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
