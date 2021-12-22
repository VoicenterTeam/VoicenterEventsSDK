<template>
    <div class="w-full flex flex-col min-h-screen relative dashboard-creation">
        <NavBar/>
        <div class="w-full px-4 lg:16 2xl:px-40 3xl:px-64 border-b border-gray-300"
             :class="{'opacity-50': loading}">
            <div class="items-center flex justify-between h-23-5">
                <div class="flex items-center xl:-mx-24 w-full">
                    <div @click="redirectBack()"
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
                             key="el-form" :model="model" ref="dashboardCreationForm">
                        <div class="flex flex-col lg:flex-row lg:items-center w-1/2 lg:w-auto">
                            <span class="label-input label-dashboard-name">
                                {{ $t('Set the Name') }}
                            </span>
                            <div class="lg:w-64 lg:mx-4">
                                <el-form-item
                                    prop="DashboardTitle"
                                    :rules="[
                                        { required: true, message: $t('Validation required', { field: $t('Dashboard Name') }) }
                                    ]"
                                >
                                    <el-input type="DashboardTitle" v-model="model.DashboardTitle" />
                                    <span class="el-form-item__error" slot="error" slot-scope="error">&nbsp;{{error.error}}</span>
                                </el-form-item>
                            </div>
                        </div>
                        <div :class="$rtl.isRTL ? 'mr-1-5':'ml-1-5'"
                             class="flex flex-col lg:flex-row lg:items-center lg:mx-0 w-1/2 lg:w-auto layout-block">
                            <span class="label-input flex-wrap">
                                {{ $t('Choose Layout') }}
                            </span>
                            <div>
                                <LayoutSelect
                                    :active-layout="{ LayoutID: model.DashboardLayoutID }"
                                    class="w-64 lg:mx-4"
                                    @on-chose-layout="onChoseLayout"
                                    :display-label="false"
                                />
                            </div>
                        </div>
                    </el-form>
                    <div class="lg:grid lg:grid-cols-4 gap-5 mb-4"
                         key="TemplateCategories">
                        <TemplateCategories class="col-span-1"
                            key="categories"
                            :categories="dashboardTemplateCategories"
                            @on-choose-category="onChooseCategory"
                        />
                        <fade-transition mode="out-in" :duration="transitionDuration">
                            <TemplatesPreview class="col-span-3"
                                key="TemplatesPreview"
                                @on-submit="tryAddDashboard"
                                :selected-template="selectedTemplate"
                                @on-select-template="onSelectTemplate"
                                @on-detailed-view="onDetailedView"
                                v-if="dashboardTemplateCategory && dashboardTemplateCategories"
                                :dashboard-category="selectedCategory"
                                :disableCreateBlankBtn="disableCreateBlankBtn" />
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
                        :disabled="!isFormValid"
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
                    DashboardLayoutID: '',
                    DashboardTemplateID: null
                },
                accountLayouts: [],
                dashboardTemplateCategories: [],
                dashboardTemplateCategory: null,
                selectedTemplate: false,
                showConfirmDialog: false,
                onViewTemplate: false,
                createBlankDashboard: false
            }
        },
        computed: {
            selectedCategory () {
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
            disableCreateBlankBtn () {
                return !this.model.DashboardTitle
            },
            isFormValid () {
                return Object.values(this.model).every(el => el !== null && el !== '')
            },
            isCreateBlankDashboard () {
                return this.createBlankDashboard && typeof this.createBlankDashboard === 'boolean'
            }
        },
        methods: {
            redirectBack() {
                this.$router.push('/')
            },
            onDiscard() {
                this.selectedTemplate = false
                this.onViewTemplate = false
                this.redirectBack()
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
            tryAddDashboard(createBlankDashboard) {
                this.createBlankDashboard = createBlankDashboard
                if (this.isCreateBlankDashboard) {
                    this.selectedTemplate = false
                    delete this.model.DashboardTemplateID
                }
                this.showConfirmDialog = true
            },
            async onSubmit() {
                try {
                    this.loading = true
                    this.showConfirmDialog = false
                    
                    const dashboard = await this.createDashboard()
                    await this.addEntities(dashboard, this.isCreateBlankDashboard)
                    await this.$store.dispatch('dashboards/getDashboards')
                    await this.$store.dispatch('dashboards/selectDashboard', dashboard)
                    
                    Notification.success('Dashboard added with success.')
                    this.redirectBack()
                } catch (e) {
                    console.warn(e)
                    Notification.error('Something went wrong please try again.')
                } finally {
                    this.loading = false
                }
            },
            async addEntities(dashboard, isCreateBlankDashboard) {
                const { DashboardID, WidgetGroupList } = dashboard
                if (!this.selectedTemplate.WidgetTemplateList || isCreateBlankDashboard) {
                    return
                }
                
                const widgetList = await this.storeDashboardWidgets()
                const WidgetGroupID = await this.storeGroup(widgetList, WidgetGroupList)
                if (!WidgetGroupID) {
                    return
                }
                await DashboardApi.addWidgetGroup(DashboardID, +WidgetGroupID)
            },
            getWidgetTemplate(templateID) {
                return this.$store.getters['widgetTemplate/getWidgetTemplate'](templateID)
            },
            async storeDashboardWidgets() {
                let widgetList = []
                const widgets = this.selectedTemplate.WidgetTemplateList
                
                for (let i = 0; i < widgets.length; i++) {
                    const templateData = this.getWidgetTemplate(widgets[i]['WidgetTemplateID'])
                    const payload = {
                        ...widgets[i],
                        WidgetConfig: templateData.DefaultWidgetConfig || [],
                        TemplateID: widgets[i]['WidgetTemplateID'],
                    }
                    const newWidget = await WidgetApi.store(payload)
                    widgetList.push(newWidget)
                }
                return widgetList
            },
            async storeGroup(widgets, widgetGroupList) {
                let newGroup = {}
                if (!widgetGroupList || !widgetGroupList.length) {
                    newGroup = { ...widgetGroupModel }
                    newGroup['WidgetList'] = widgets
                    const { WidgetGroupID } = await WidgetGroupsApi.store(newGroup)
                    return WidgetGroupID
                } else {
                    newGroup = widgetGroupList[0]
                    newGroup['WidgetList'] = widgets
                    await WidgetGroupsApi.update(newGroup)
                    const groupID = +newGroup.WidgetGroupID
                    const savePromises = widgets.map(widget =>
                        WidgetGroupsApi.addWidget(groupID, +widget.WidgetID)
                    )
                    await Promise.all(savePromises)
                    return false
                }
            },
            async newDashboard() {
                await this.getAccountLayouts()
                this.model.DashboardLayoutID = this.dashboardLayoutID
            },
            async createDashboard () {
                return await DashboardApi.store({
                    ...this.model,
                    AccountID: this.currentAccountId,
                })
            }
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
            }
        }
    }
</script>
<style lang="scss" scoped>
.label-input {
    @apply whitespace-nowrap text-gray-900 text-main-sm font-medium truncate;
}
.label-dashboard-name, .layout-block {
    @apply mb-5.5;
}
@media (max-width: 640px) {
    .label-dashboard-name {
        @apply mb-0;
    }
}
</style>
