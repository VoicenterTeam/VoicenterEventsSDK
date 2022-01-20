<template>
    <div class="md:grid md:grid-cols-6 gap-6 my-6 template-preview_wrapper">
        <div class="col-span-4 border rounded shadow-base pointer-events-none">
                <div class="relative"
                :class="{'full-screen': fullScreenMode}">
                <div class="border border-gray-550 rounded preview-wrapper">
                    <div class="content relative"
                        id="dashboard-preview" :style="getStyles">
                        <slot>
                            <DashboardPreview
                                class="absolute"
                                :show-loading-indicator="false"
                                :template="template"
                            />
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-0-5 w-full bg-gray-350 my-4 md:hidden"/>
        <div class="col-span-2">
            <div class="flex items-center mb-2">
                <i>
                    <IconTemplate class="text-primary"/>
                </i>
                <span class="mx-2">
                    {{ $t(template.DashboardTemplateName) }}
                </span>
            </div>
            <p>
                {{ $t(template.DashboardTemplateDescription) }}
            </p>
            <div class="h-0-5 w-full bg-gray-350 my-4 md:hidden"/>
            <div class="flex items-center mt-4 mb-2">
                <i>
                    <IconTimerSm class="text-primary"/>
                </i>
                <span class="mx-2">
                    {{ $t('Timers') }}
                </span>
            </div>
            <div v-html="getReportSettings"/>
            <div v-html="getTimeSettings"/>
            <div class="h-0-5 w-full bg-gray-350 my-4 md:hidden"/>
            <div class="flex items-center mt-4 mb-2">
                <IconDashboardColor class="text-primary"/>
                <span class="mx-1">{{ $t('Colors') }}</span>
            </div>
            <div class="flex flex-col">
                <div v-for="group in getColorParameters"
                     :key="group.JPath">
                    <div class="flex">
                        <p>{{ $t(group.LayoutParameterName) }}:</p>
                        <i class="mx-2">
                            <IconColorPicker class="w-6 h-6 mx-0-5"
                                             :style="getIndicatorStyles(group)"/>
                        </i>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-0-5 w-full bg-gray-350 my-4 md:hidden"/>
        <div class="col-span-6 lg:col-span-3 mb-3 md:mb-0"
             v-for="widget in template.WidgetTemplateList"
             :key="template.DashboardTemplateWidgetID">
            <TemplateWidget :widget="widget"
                            :template="template"/>
        </div>
    </div>
</template>
<script>
    import TemplateWidget from '@/views/DashboardCreation/components/TemplateWidget'
    import { DEFAULT_GROUP_KEYS } from '@/views/DashboardSettings/LayoutManagement/layout-management'
    import DashboardPreview from '@/views/DashboardPreview'
    
    export default {
        components: {
            TemplateWidget,
            DashboardPreview
        },
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
            model: {
                type: Object,
                default: () => ({}),
            }
        },
        data() {
            return {
                groupKeys: DEFAULT_GROUP_KEYS,
                realTimePreview: true,
                zoom: this.defaultZoom,
                fullScreenMode: false
            }
        },
        computed: {
            activeLayout() {
                return this.$store.getters['layout/getPreviewLayout']
            },
            getTimeSettings() {
                const MinRefreshInterval = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'MinRefreshInterval')
                const ReportInterval = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportInterval')
                return `<p>${this.$t('Minimum refresh interval for real time widgets')}: <b>${MinRefreshInterval.Value}s</b>,  </p> <p>${this.$t('Switch category every')}: <b>${ReportInterval.Value}s</b></p>`
            },
            getReportSettings() {
                const ReportSwitching = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportSwitching')
                const ReportRefresh = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportRefresh')
                const _ReportSwitching = ReportSwitching ? 'enabled' : 'disabled'
                const _ReportRefresh = ReportRefresh ? 'enabled' : 'disabled'
                return `<p>${this.$t('Category switching')}: <b>${_ReportSwitching}</b>, </p> <p> ${this.$t('Category refresh')}: <b>${_ReportRefresh}</b></p>`
            },
            getColorParameters() {
                const group = this.groupKeys['Colors']
                return this.getGroupedParameters(group)
            },
            getStyles() {
                return {
                    zoom: 0.5
                }
            }
        },
        methods: {
            getGroupedParameters(group) {
                return this.activeLayout.LayoutParametersList.filter((el) => group.includes(el.LayoutParameterName))
            },
            getIndicatorStyles(config) {
                return {
                    'color': config.Value,
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
.template-preview_wrapper ::v-deep {
    p {
        @apply text-gray-950 text-sm;
    }
}
</style>
