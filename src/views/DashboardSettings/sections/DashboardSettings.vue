<template>
    <div class="text-gray-900">
        <div class="grid grid-cols-4 col-gap-6 lg:col-gap-12 dashboard-settings">
            <div class="col-span-4 border-b pb-3 md:pb-0 md:border-none md:col-span-1">
                <div class="flex items-center mb-3">
                    <div class="flex">
                        <IconDashboardName class="text-primary mb-1"/>
                    </div>
                    <div class="flex px-1 label-input">
                        {{ $t('Dashboard Name') }}
                    </div>
                </div>
                <el-input v-model="value.DashboardTitle"/>
            </div>
            <div class="col-span-4 md:col-span-1 pt-4 border-b pb-3 md:pb-0 md:border-none md:pt-0">
                <div class="flex items-center mb-4">
                    <div class="flex">
                        <IconDashboardColor class="text-primary"/>
                    </div>
                    <div class="flex mx-1 label-input">{{ $t('Dashboard Color') }}</div>
                </div>
                <div class="flex flex-row items-center -mt-3">
                    <ColorParameterType v-bind="primaryColorSettings"
                                        v-if="!defaultLayout"
                                        :display-label="false"
                                        v-model="primaryColorSettings.Value">
                        <IconColorPicker class="w-6 h-6 text-primary"/>
                    </ColorParameterType>
                    <div v-else
                         class="mt-4">
                        <IconColorPicker class="w-6 h-6 text-primary"
                        />
                    </div>
                </div>
            </div>
            <div class="col-span-4 md:col-span-1 pt-4 border-b pb-3 md:pb-0 md:border-none md:pt-0">
                <div class="flex items-center mb-4">
                    <div class="flex">
                        <IconDashboardLogo class="text-primary mb-0-5"/>
                    </div>
                    <div class="flex mx-1 label-input">{{ $t('Dashboard Logo') }}</div>
                </div>
                <div class="flex flex-row items-center">
                    <img :src="getLogo" alt="Logo"
                         class="h-6 object-cover">
                    <LayoutLogo class="mx-2"
                                :disabled="defaultLayout"/>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-4 col-gap-6 lg:col-gap-12 mt-6 sm:mt-12">
            <div class="col-span-4 md:col-span-1 mb-4 md:mb-0">
                <LayoutManagementSelect v-on="$listeners"/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <div class="shadow-base w-full px-5 py-4 rounded-lg"
                     v-if="activeLayout">
                    <div class="flex justify-between">
                        <div class="flex flex-col">
                            <div class="flex items-center mb-2">
                                <IconDashboardColor class="text-primary"/>
                                <span class="mx-1">{{ $t('Colors') }}</span>
                            </div>
                            <div class="flex flex-row">
                                <div v-for="group in getColorParameters"
                                     :key="group.JPath">
                                    <IconColorPicker class="w-6 h-6 mx-0-5"
                                                     :style="getIndicatorStyles(group)"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex items-center mb-2">
                                <IconFonts class="text-primary"/>
                                <span class="mx-1">{{ $t('Fonts') }}</span>
                            </div>
                            <div class="text-xs text-gray-900">
                                {{ getFontInfos }}
                            </div>
                        </div>
                        <div class="hidden flex-col lg:flex">
                            <div class="flex items-center mb-2">
                                <i>
                                    <IconTimer class="text-primary"/>
                                </i>
                                <span class="mx-1">{{ $t('Time Settings') }}</span>
                            </div>
                            <div class="text-xs text-gray-900">
                                {{ getTimeSettings }} <br>
                                {{ getReportSettings }}
                            </div>
                        </div>
                        <div class="cursor-pointer text-primary-300 hover:text-primary"
                             v-if="!defaultLayout"
                             @click="onEditLayout">
                            <div class="flex items-center">
                                <IconPencil class="w-4 h-4"/>
                                <div>{{ $t('Edit') }}</div>
                            </div>
                        </div>
                        <el-tooltip v-else
                                    :content="$t('This is a default config, please add a new one if you want to edit it')"
                                    placement="top">
                            <AlertTriangleIcon class="text-orange-500 cursor-help w-4-5 h-4-5"/>
                        </el-tooltip>
                    </div>
                    <div class="flex flex-col lg:hidden mt-4">
                        <div class="flex items-center mb-2">
                            <i>
                                <IconTimer class="text-primary"/>
                            </i>
                            <span class="mx-1">{{ $t('Time Settings') }}</span>
                        </div>
                        <div class="text-xs text-gray-900">
                            {{ getTimeSettings }} <br>
                            {{ getReportSettings }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <WidgetGroupManagement v-if="currentDashboard.WidgetGroupList"
                               class="w-full mt-12"
                               v-on="$listeners"
                               :widget-group-list="currentDashboard.WidgetGroupList"
        />
    </div>
</template>
<script>
    import { PenToolIcon } from 'vue-feather-icons'
    import LayoutLogo from '@/views/common/LayoutLogo'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { AlertTriangleIcon } from 'vue-feather-icons'
    import LayoutManagementSelect from '@/views/common/LayoutManagementSelect'
    import WidgetGroupManagement from '@/views/DashboardSettings/components/WidgetGroupManagement'
    import ColorParameterType from '@/views/DashboardSettings/LayoutManagement/components/ColorParameterType'
    import { DEFAULT_GROUP_KEYS, PRIMARY_COLOR_KEY } from '@/views/DashboardSettings/LayoutManagement/layout-management'
    
    export default {
        components: {
            LayoutLogo,
            PenToolIcon,
            AlertTriangleIcon,
            ColorParameterType,
            WidgetGroupManagement,
            LayoutManagementSelect,
        },
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
            currentDashboard: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                groupKeys: DEFAULT_GROUP_KEYS,
            }
        },
        computed: {
            defaultLayout() {
                return this.activeLayout.LayoutID === DEFAULT_LAYOUT_ID
            },
            getLogo() {
                return this.$store.getters['layout/getLogo']
            },
            activeLayout() {
                return this.$store.getters['layout/getActiveLayout']
            },
            getColorParameters() {
                const group = this.groupKeys['Colors']
                return this.getGroupedParameters(group)
            },
            getFontInfos() {
                const base = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'FontSize')
                const header = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'WidgetGroupTitlesFontSize')
                return `${this.$t('Base')} - ${base.Value}px, ${this.$t('Headers')} - ${header.Value}px`
            },
            getTimeSettings() {
                const MinRefreshInterval = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'MinRefreshInterval')
                const ReportInterval = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportInterval')
                return `${this.$t('Refresh interval')}: ${MinRefreshInterval.Value}s,   ${this.$t('Switch category every')}: ${ReportInterval.Value}s`
            },
            getReportSettings() {
                const ReportSwitching = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportSwitching')
                const ReportRefresh = this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === 'ReportRefresh')
                const _ReportSwitching = ReportSwitching ? 'enabled' : 'disabled'
                const _ReportRefresh = ReportRefresh ? 'enabled' : 'disabled'
                return `${this.$t('Category switching')} ${_ReportSwitching}, ${this.$t('Category refresh')} ${_ReportRefresh}`
            },
            primaryColorSettings() {
                return this.activeLayout.LayoutParametersList.find((el) => el.LayoutParameterName === PRIMARY_COLOR_KEY)
            },
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
            onEditLayout() {
                this.$router.push('layout-settings')
            },
        },
    }
</script>
<style lang="scss" scoped>
.label-input {
    @apply flex w-full text-gray-900 text-main-sm font-medium truncate;
}
</style>
