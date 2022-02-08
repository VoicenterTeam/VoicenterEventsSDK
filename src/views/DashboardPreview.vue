<template>
    <div class="transition flex relative flex-col dashboard-wrapper" :style="setRootColors">
        <base-navbar
            key="base-navbar"
            :editMode="editMode"
            layoutType="previewLayout">
            <template v-slot:dashboard-operations>
                <div v-if="layoutType !== 'tabbed'"
                     class="flex items-center">
                    <new-group-button
                        :disabled="editMode"
                        @click="addNewGroup"
                    />
                    <IconVerticalLine class="mx-6 h-12"/>
                </div>
                <div class="flex items-center">
                    <layout-switcher
                        :active-type="layoutType"
                        :edit-mode="editMode"
                    />
                </div>
            </template>
        </base-navbar>
        <div class="dashboard"
            v-loading="loadingData"
            :key="activeLanguage"
            v-if="activeDashboardData && activeDashboardData.WidgetGroupList.length"
        >
            <div class="dashboard-container min-h-screen mb-10">
                <fade-transition :duration="300" mode="out-in">
                    <sidebar
                        :active-tab="activeWidgetGroupID"
                        :widget-group-list="activeDashboardData.WidgetGroupList"
                        :layout-type="layoutType"
                        :show-tabs="true"
                    />
                </fade-transition>
                <div class="flex justify-center w-full">
                    <div v-if="editMode"
                        class="w-20 bg-gray-400 text-gray-600 hover:text-primary h-3 w-20 rounded-b-2xl text-white cursor-pointer flex items-center justify-center"
                    >
                        <IconArrowUp v-if="showSidebar"/>
                        <IconArrowDown v-else/>
                    </div>
                </div>
                <div class="p-1">
                    <fade-transition :duration="250" mode="out-in">
                        <TabbedView
                            :active-tab="activeWidgetGroupID"
                            :active-dashboard-data="activeDashboardData"
                            :layout-type="layoutType"
                            :widget-group-list="activeDashboardData.WidgetGroupList"
                            :widget-templates="allWidgetTemplates"
                            :editedGroup="groupToEdit"
                        />
                    </fade-transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import NewGroupButton from '@/components/NewGroupButton'
    import Sidebar from '@/components/LayoutRendering/Sidebar'
    import Switcher from '@/components/LayoutRendering/Switcher'
    import DashboardOperations from '@/helpers/DashboardOperations'
    import TabbedView from '@/components/LayoutRendering/Types/TabbedView'
    import { widgetGroupModel } from '@/models/instances'

    export default {
        components: {
            [Switcher.name]: Switcher,
            NewGroupButton,
            TabbedView,
            Sidebar
        },
        props: {
            showLoadingIndicator: {
                type: Boolean,
                default: true
            },
            template: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                loading: false,
                editMode: false,
                activeDashboardData: null,
                layoutType: 'tabbed',
                operations: new DashboardOperations(),
                activeTab: this.activeWidgetGroupID,
                groupToEdit: null,
                showSidebar: true
            }
        },
        computed: {
            loadingData() {
                if (!this.showLoadingIndicator) {
                    return false
                }
                return this.$store.state.dashboards.loadingData || this.loading
            },
            activeLanguage() {
                return this.$store.state.lang.language
            },
            allWidgetTemplates() {
                return this.template.WidgetTemplateList
            },
            activeWidgetGroupID() {
                return this.widgetGroup.WidgetGroupID
            },
            widgetListToDisplay() {
                return this.template.WidgetTemplateList.map(el => {
                    el.TemplateID = el.WidgetTemplateID
                    el.WidgetID = el.WidgetTemplateID
                    el.Title = el.DefaultWidgetTitle
                    el.WidgetConfig = el.DefaultWidgetConfig

                    return el
                })
            },
            widgetGroup () {
                return { ...widgetGroupModel() }
            },
            activeTemplates () {
                return this.template
            },
            colors() {
                return this.$store.getters['layout/colors']('previewLayout')
            },
            fontSize() {
                return this.$store.getters['layout/baseFontSize']('previewLayout')
            },
            setRootColors () {
                const rootVariables = {}
                const colors = this.colors
                const fontSize = this.fontSize

                for (let color in colors) {
                    rootVariables[`--${color}-color`] = colors[color]
                }

                rootVariables['--font-size-xs'] = (fontSize - 4) + 'px'
                rootVariables['--font-size-sm'] = (fontSize - 2) + 'px'
                rootVariables['--font-size-base'] = fontSize + 'px'
                rootVariables['--font-size-lg'] = (fontSize + 2) + 'px'
                rootVariables['--font-size-xl'] = (fontSize + 4) + 'px'
                rootVariables['--font-size-2xl'] = (fontSize + 6) + 'px'
                rootVariables['--font-size-3xl'] = (fontSize + 12) + 'px'
                rootVariables['--primary-actions'] = rootVariables['--primary-color']

                return rootVariables
            }
        },
        methods: {
            renderDashboard() {
                this.activeDashboardData = {
                    WidgetGroupList: [
                        {
                            WidgetGroupID: this.activeWidgetGroupID,
                            Order: 0,
                            WidgetGroupTitle: '',
                            WidgetList: this.widgetListToDisplay
                        }
                    ]
                }
            }
        },
        created() {
            window.grids = []
        },
        mounted() {
            this.renderDashboard()
        }
    }
</script>
<style lang="scss">
.dashboard-wrapper {
    @apply w-full;
}

.flip-list-move {
    transition: transform 0.5s;
}

.el-table__row .cell {
    @apply text-gray-500;
}

.rtl .el-dialog__headerbtn {
    left: 20px;
    right: auto;
}

.rtl .el-button--default {
    margin-left: 10px;
}

.dashboard > .el-loading-mask > .el-loading-spinner {
    @apply fixed;
}

.transition {
    transition: all 0.3s ease-in;
}

.rounded-b-2xl {
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
}
.preview-wrapper .el-input__suffix-inner {
    pointer-events: none;
}
</style>
