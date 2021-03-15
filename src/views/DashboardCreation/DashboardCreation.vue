<template>
    <div class="w-full flex flex-col min-h-screen relative dashboard-creation">
        <NavBar/>
        <div class="w-full px-4 lg:16 2xl:px-40 3xl:px-64 border-b border-gray-300"
             :class="{'opacity-50': loading}">
            <div class="items-center flex justify-between h-23-5">
                <div class="flex items-center xl:-mx-24 w-full">
                    <div @click="onBack()"
                         class="col-span-1 flex items-center text-primary-300 hover:text-primary cursor-pointer">
                        <IconDirLeft/>
                        <span class="mx-1">{{ $t('Back') }}</span>
                    </div>
                    <span class="mx-8">
                    <svg width="1" height="88" viewBox="0 0 1 88" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect width="1" height="88" fill="#EBEBEB"/>
                    </svg>
                </span>
                    <span class="text-xl font-bold text-gray-900">
                    {{ $t('Dashboard Creation') }}
                </span>
                </div>
            </div>
        </div>
        <div class="w-full px-4 mt-6 lg:px-16 2xl:px-40 3xl:px-64">
            <transition-group name="flip">
                <template v-if="!onViewTemplate">
                    <el-form class="flex flex-row items-center my-8"
                             key="el-form">
                        <div class="flex flex-col lg:flex-row lg:items-center w-1/2 lg:w-auto">
                            <span class="label-input">
                                {{ $t('Set the Name') }}
                            </span>
                            <div class="lg:w-64 lg:mx-4">
                                <el-input v-model="model.DashboardTitle"/>
                            </div>
                        </div>
                        <div :class="$rtl.isRTL ? 'mr-1-5':'ml-1-5'"
                             class="flex flex-col lg:flex-row lg:items-center lg:mx-0 w-1/2 lg:w-auto">
                            <span class="label-input flex-wrap">
                                {{ $t('Choose Layout') }}
                            </span>
                            <div>
                                <LayoutSelect class="w-64 lg:mx-4"
                                              @on-chose-layout="onChoseLayout"
                                              :display-label="false"
                                />
                            </div>
                        </div>
                    </el-form>
                    <div class="lg:grid lg:grid-cols-4 col-gap-5"
                         key="TemplateCategories">
                        <TemplateCategories class="col-span-1"
                                            key="categories"
                                            :categories="dashboardTemplateCategories"
                                            @on-choose-category="onChooseCategory"
                        />
                        <fade-transition mode="out-in"
                                         :duration="transitionDuration">
                            <TemplatesPreview class="col-span-3"
                                              key="TemplatesPreview"
                                              @on-submit="tryAddDashboard"
                                              :selected-template="selectedTemplate"
                                              @on-select-template="onSelectTemplate"
                                              @on-detailed-view="onDetailedView"
                                              v-if="dashboardTemplateCategory"
                                              :dashboard-category="selectedCategory"/>
                        </fade-transition>
                    </div>
                </template>
                <template v-else>
                    <TemplateDetailedPreview key="to-preview"
                                             :template="selectedTemplate"/>
                </template>
            </transition-group>
        </div>
        <div class="flex w-full items-center">
            <div class="mx-4 lg:mx-16 2xl:mx-40 3xl:mx-64 flex w-full justify-between items-center">
                <base-button class="mx-4"
                             @click="onDiscard"
                             variant="discard"
                >
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ $t('Discard') }}</span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             :loading="loading"
                             :disabled="!selectedTemplate"
                             @click="tryAddDashboard">
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ $t('Save') }}</span>
                    </div>
                </base-button>
            </div>
        </div>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       title="Add Dashboard"
                       description="Please confirm you action?"
        >
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <base-button class="mx-4"
                                 @click="showConfirmDialog = false"
                                 variant="discard"
                                 fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">
                                {{ 'Cancel' }}
                            </span>
                        </div>
                    </base-button>
                    <base-button @click="onSubmit"
                                 fixed-width="w-37"
                                 key="store">
                        {{ $t('Confirm') }}
                    </base-button>
                </slot>
            </template>
        </ConfirmDialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Notification } from 'element-ui'
    import NavBar from '@/views/common/NavBar'
    import { WidgetApi } from '@/api/widgetApi'
    import { templateApi } from '@/api/templateApi'
    import { DashboardApi } from '@/api/dashboardApi'
    import pageSizeMixin from '@/mixins/pageSizeMixin'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { widgetGroupModel } from '@/models/instances'
    import { WidgetGroupsApi } from '@/api/widgetGroupApi'
    import LayoutSelect from '@/views/common/LayoutSelect'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import { getLayoutsWithPrimaryColor } from '@/helpers/layoutUtil'
    import TemplatesPreview from '@/views/DashboardCreation/components/TemplatesPreview'
    import TemplateCategories from '@/views/DashboardCreation/components/TemplateCategories'
    import TemplateDetailedPreview from '@/views/DashboardCreation/components/TemplateDetailedPreview'
    
    export default {
        components: {
            TemplateDetailedPreview,
            TemplateCategories,
            TemplatesPreview,
            ConfirmDialog,
            LayoutSelect,
            NavBar,
        },
        mixins: [pageSizeMixin],
        data() {
            return {
                transitionDuration: 250,
                loading: false,
                model: {
                    DashboardTitle: 'New Dashboard',
                    DashboardLayoutID: 1,
                },
                accountLayouts: [],
                dashboardTemplateCategories: [],
                dashboardTemplateCategory: null,
                selectedTemplate: false,
                showConfirmDialog: false,
                onViewTemplate: false,
            }
        },
        computed: {
            selectedCategory() {
                return this.dashboardTemplateCategories.find(category => category.DashboardTemplateCategoryID.toString() === this.dashboardTemplateCategory.DashboardTemplateCategoryID.toString())
            },
            dashboardLayoutID() {
                return get(this.activeDashboard, 'DashboardLayoutID', DEFAULT_LAYOUT_ID)
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
            activeLanguage() {
                return this.$store.state.lang.language
            },
        },
        methods: {
            onBack() {
                this.$router.push('/')
            },
            onDiscard() {
                this.selectedTemplate = false
                this.onViewTemplate = false
            },
            onChoseLayout(layout) {
                this.model.DashboardLayoutID = layout.LayoutID
            },
            onSelectTemplate(template) {
                this.selectedTemplate = template
                this.model.DashboardTemplateID = template.DashboardTemplateID
            },
            onDetailedView(template) {
                this.onViewTemplate = !this.onViewTemplate
                return this.onSelectTemplate(template)
            },
            onChooseCategory(category) {
                this.dashboardTemplateCategory = category
                this.selectedTemplate = false
                this.onViewTemplate = false
            },
            async getDashboardTemplates() {
                try {
                    this.dashboardTemplateCategories = await templateApi.getDashboardTemplates()
                } catch (e) {
                    console.warn(e)
                }
            },
            async getAccountLayouts() {
                try {
                    const accountID = this.currentAccountId
                    this.accountLayouts = await getLayoutsWithPrimaryColor(accountID)
                } catch (e) {
                    console.warn(e)
                }
            },
            tryAddDashboard() {
                this.showConfirmDialog = true
            },
            async onSubmit() {
                try {
                    this.loading = true
                    this.showConfirmDialog = false
                    
                    const dashboard = await DashboardApi.store({
                        ...this.model,
                        AccountID: this.currentAccountId,
                    })
                    
                    await this.addEntities(dashboard)
                    await this.$store.dispatch('dashboards/getDashboards')
                    await this.$store.dispatch('dashboards/selectDashboard', dashboard)
                    
                    Notification.success('Dashboard added with success.')
                } catch (e) {
                    console.warn(e)
                    Notification.error('Something went wrong please try again.')
                } finally {
                    this.loading = false
                }
            },
            async addEntities(dashboard) {
                const { DashboardID, WidgetGroupList} = dashboard
                if (!this.selectedTemplate.WidgetTemplateList) {
                    return
                }
                
                let widgetList = []
                const widgets = this.selectedTemplate.WidgetTemplateList
                
                for (let i = 0; i < widgets.length; i++) {
                    const payload = {
                        ...widgets[i],
                        TemplateID: widgets[i]['WidgetTemplateID'],
                    }
                    const newWidget = await WidgetApi.store(payload)
                    widgetList.push(newWidget)
                }
                
                let newGroup ={}
                if (!WidgetGroupList || WidgetGroupList.length) {
                    newGroup = { ...widgetGroupModel }
                } else {
                    newGroup = WidgetGroupList[0]
                }
                
                newGroup['WidgetList'] = widgetList
                
                const { WidgetGroupID } = await WidgetGroupsApi.store(newGroup)
                await DashboardApi.addWidgetGroup(DashboardID, +WidgetGroupID)
            },
            newDashboard() {
                this.getAccountLayouts()
                this.model.DashboardLayoutID = this.dashboardLayoutID
            },
        },
        async mounted() {
            this.loading = true
            await this.newDashboard()
            await this.getDashboardTemplates()
            this.loading = false
            window.grids = []
        },
        watch: {
            async activeLanguage() {
                await this.getDashboardTemplates()
            },
        },
    }
</script>
<style lang="scss" scoped>
.label-input {
    @apply whitespace-no-wrap text-gray-900 text-main-sm font-medium truncate;
}
</style>
