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
                        <span class="mx-1">{{ $t('general.back') }}</span>
                    </div>
                    <span class="mx-8">
                    <svg width="1" height="88" viewBox="0 0 1 88" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect width="1" height="88" fill="#EBEBEB"/>
                    </svg>
                </span>
                    <span class="text-2xl font-bold text-gray-900">
                    {{ $t('dashboard.dashboardCreation') }}
                </span>
                </div>
            </div>
        </div>
        <div class="w-full px-4 mt-6 lg:px-16 2xl:px-40 3xl:px-64">
            <div v-if="!onViewTemplate">
                <el-form
                    class="flex flex-row items-center my-8"
                    :model="model"
                    ref="dashboardCreationForm"
                >
                    <div class="flex flex-col lg:flex-row lg:items-center w-1/2 lg:w-auto">
                        <span class="label-input label-dashboard-name">
                            {{ $t('dashboard.setTheName') }}
                        </span>
                        <div class="lg:w-80 lg:mx-5">
                            <el-form-item
                                prop="DashboardTitle"
                                :rules="[
                                    { required: true, message: $t('validation.error.fieldIsRequired', { field: $t('dashboard.dashboardName') }) }
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
                            {{ $t('dashboard.chooseLayout') }}
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
                <div
                    class="mb-18 template-categories"
                >
                    <div class="flex">
                        <div>
                            <div class="flex flex-row items-center justify-between text-main-base font-medium mb-4">
                                {{ $t("general.types") }}
                            </div>
                            <TemplateCategories class="col-span-1 w-48 mr-6"
                                :categories="dashboardTemplateCategories"
                                @on-choose-category="onChooseCategory"
                            />
                        </div>
                        <div class="w-full">
                            <div class="pr-3 flex flex-row items-center justify-between text-main-base font-medium mb-4">
                                <span v-if="selectedCategory && selectedCategory.DashboardTemplateCategoryDescription">{{ selectedCategory.DashboardTemplateCategoryDescription }}</span>
                                <button class="create-blank-dashboard text-primary cursor-pointer flex items-center font-medium"
                                    @click="tryAddDashboard(true)" :disabled="disableCreateBlankBtn || loading">
                                    <i class="vc-icon-plus-linear mx-1 font-bold text-xl" />
                                    {{ $t('dashboard.createBlankDashboard') }}
                                </button>
                            </div>
                            <TemplatesPreview
                                :selected-template="selectedTemplate"
                                @on-select-template="onSelectTemplate"
                                @on-detailed-view="onDetailedView"
                                v-if="dashboardTemplateCategory && dashboardTemplateCategories"
                                :dashboard-category="selectedCategory"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <TemplateDetailedPreview
                    :template="selectedTemplate"
                />
            </div>
        </div>
        <div class="flex w-full items-center border-t py-6">
            <div class="mx-4 lg:mx-16 2xl:mx-40 3xl:mx-64 flex w-full justify-between items-center">
                <cancel-button
                    class="mx-4"
                    @on-click="onDiscard"
                />
                <confirm-button
                    :disabled="loading"
                    :label="$t('common.save')"
                    @on-click="tryAddDashboard"
                />
            </div>
        </div>
        <ConfirmDialog
            :visible.sync="showConfirmDialog"
            :title="$t('dashboard.addDashboard')"
            :description="$t('dashboard.confirm.action')"
        >
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <cancel-button
                        class="mx-4"
                        @on-click="onCancelDialog"
                    />
                    <confirm-button
                        :loading="loading"
                        @on-click="onSubmit"
                    />
                </slot>
            </template>
        </ConfirmDialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { WidgetApi } from '@/api/widgetApi'
    import { templateApi } from '@/api/templateApi'
    import { DashboardApi } from '@/api/dashboardApi'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { widgetGroupModel } from '@/models/instances'
    import { WidgetGroupsApi } from '@/api/widgetGroupApi'
    import { getLayoutsWithPrimaryColor } from '@/helpers/layoutUtil'
    import notification from '@/mixins/simpleNotification'


    export default {
        components: {
            TemplateDetailedPreview: () => import('@/views/DashboardCreation/components/TemplateDetailedPreview'),
            TemplateCategories: () => import('@/views/DashboardCreation/components/TemplateCategories'),
            TemplatesPreview: () => import('@/views/DashboardCreation/components/TemplatesPreview'),
            ConfirmDialog: () => import('@/components/Common/ConfirmDialog'),
            LayoutSelect: () => import('@/views/common/LayoutSelect'),
            NavBar: () => import('@/views/common/NavBar'),
            CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
            ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
        },
        data() {
            return {
                transitionDuration: 250,
                loading: false,
                model: {
                    DashboardTitle: this.$t('common.newDashboard'),
                    DashboardLayoutID: '',
                    DashboardTemplateID: null
                },
                accountLayouts: [],
                dashboardTemplateCategories: [],
                dashboardTemplateCategory: null,
                selectedTemplate: false,
                showConfirmDialog: false,
                onViewTemplate: false,
                isCreateBlankDashboard: false,
                isPreviewDashboardTemplate: false
            }
        },
        computed: {
            selectedCategory () {
                if (!this.dashboardTemplateCategories.length || !this.dashboardTemplateCategory) {
                    return
                }
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
            allLayouts() {
                return this.$store.getters['layout/getAllLayouts']
            }
        },
        methods: {
            async redirectBack() {
                if (this.isPreviewDashboardTemplate) {
                    this.onViewTemplate = false
                    this.isPreviewDashboardTemplate = false
                    this.isCreateBlankDashboard = false
                    this.model.DashboardTemplateID = null
                } else {
                    this.$router.push('/')
                    await this.$store.dispatch('layout/resetPreviewLayout')
                }
            },
            onCancelDialog () {
                this.showConfirmDialog = false
            },
            onDiscard() {
                this.selectedTemplate = false
                this.onViewTemplate = false
                this.redirectBack()
            },
            onChoseLayout(layout) {
                this.model.DashboardLayoutID = layout.LayoutID
                this.$store.dispatch('layout/setPreviewLayout', layout)
            },
            onSelectTemplate(template) {
                this.selectedTemplate = template
                this.model.DashboardTemplateID = template.DashboardTemplateID
            },
            onDetailedView(template) {
                this.onViewTemplate = !this.onViewTemplate
                this.isPreviewDashboardTemplate = true
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
            tryAddDashboard(isCreateBlankDashboard = false) {
                this.isCreateBlankDashboard = isCreateBlankDashboard
                if (this.isCreateBlankDashboard) {
                    this.selectedTemplate = false
                    delete this.model.DashboardTemplateID
                    this.showConfirmDialog = true
                    return
                }
                if (this.isPreviewDashboardTemplate) {
                    this.showConfirmDialog = true
                    return
                }
                if (!this.model.DashboardTemplateID) {
                    this.$notify({
                        type: 'primary',
                        icon: true,
                        title: this.$t('widget.creating.youNeedChooseOneTemplate')
                    })
                    return
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
                    await this.$store.dispatch('layout/resetPreviewLayout')

                    notification.call({
                        type: 'success',
                        message: this.$t('dashboard.dashboardAddedWithSuccess')
                    })
                    this.$router.push('/')
                } catch (e) {
                    console.warn(e)
                    notification.call({
                        type: 'error',
                        message: this.$t('dashboard.somethingWentWrongPleaseTryAgain')
                    })
                } finally {
                    this.loading = false
                }
            },
            async addEntities(dashboard, isCreateBlankDashboard) {
                const { DashboardID, WidgetGroupList } = dashboard
                if (!this.selectedTemplate.WidgetTemplateList || isCreateBlankDashboard) {
                    return
                }

                const WidgetGroupID = get(WidgetGroupList, '[0].WidgetGroupID', null)

                if (!WidgetGroupID) {
                    return
                }

                await this.storeDashboardWidgets(DashboardID, WidgetGroupID)
            },
            getWidgetTemplate(templateID) {
                return this.$store.getters['widgetTemplate/getWidgetTemplate'](templateID)
            },
            async storeDashboardWidgets(DashboardID, WidgetGroupID) {
                let widgetList = []
                const widgets = this.selectedTemplate.WidgetTemplateList

                for (let i = 0; i < widgets.length; i++) {
                    const templateData = this.getWidgetTemplate(widgets[i]['WidgetTemplateID'])
                    const payload = {
                        ...widgets[i],
                        DashboardID,
                        WidgetGroupID,
                        WidgetConfig: templateData.DefaultWidgetConfig || [],
                        TemplateID: widgets[i]['WidgetTemplateID'],
                    }
                    const newWidget = await WidgetApi.store(payload)
                    widgetList.push(newWidget.Data)
                }
                return widgetList
            },
            async storeGroup(widgets, widgetGroupList) {
                let newGroup = {}
                if (!widgetGroupList || !widgetGroupList.length) {
                    newGroup = { ...widgetGroupModel() }
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
            const layout = this.allLayouts[0]
            this.$store.dispatch('layout/setPreviewLayout', layout)
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
    @apply whitespace-nowrap text-black font-medium truncate;
}
.label-dashboard-name, .layout-block {
    @apply mb-5.5;
}
@media (max-width: 640px) {
    .label-dashboard-name {
        @apply mb-0;
    }
}
::v-deep .dashboard-creation-btn button {
    @apply w-32 h-9 p-0;
}
::v-deep .el-input input {
    @apply text-gray-950;
}
.template-categories {
    min-height: 518px;
    height: 100%;
}
</style>
