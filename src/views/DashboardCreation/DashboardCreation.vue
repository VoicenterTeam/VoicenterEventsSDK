<template>
    <div class="w-full flex flex-col min-h-screen relative dashboard-creation"
         v-loading="loading">
        <NavBar/>
        <div class="absolute h-0-25 w-full bg-gray-300 mt-39"/>
        <div class="flex-1 overflow-auto px-4 lg:px-32 xl:px-64"
             :class="{'opacity-50': loading}">
            <div class="items-center flex justify-start h-23 text-2xl text-gray-950 leading-7">
                {{ $t('Dashboard Creation') }}
            </div>
            <el-form class="flex flex-row items-center my-8">
                <div class="flex flex-col lg:flex-row lg:items-center">
                    <label class="label-input">
                        {{ $t('Set the Name') }}
                    </label>
                    <div class="w-64 lg:mx-4">
                        <el-input v-model="model.DashboardTitle"/>
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row lg:items-center mx-6 lg:mx-0">
                    <span class="label-input block">
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
            <div class="grid grid-cols-4 col-gap-5">
                <TemplateCategories class="col-span-1"
                                    :categories="dashboardTemplateCategories"
                                    @on-choose-category="onChooseCategory"/>
                <fade-transition mode="out-in" :duration="transitionDuration">
                    <TemplatesPreview class="col-span-3"
                                      v-if="dashboardTemplateCategory"
                                      :dashboard-category="selectedCategory"/>
                </fade-transition>
            </div>
        </div>
        <div class="border-t border-gray-300 flex w-full items-center h-23-5">
            <div class="mx-4 lg:mx-32 xl:mx-64 flex w-full justify-between items-center">
                <base-button class="mx-4"
                             @click="onCancel"
                             variant="discard"
                >
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ $t('Cancel') }}</span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             :loading="loading"
                             @click="onSubmit">
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">{{ $t('Save') }}</span>
                    </div>
                </base-button>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import i18n from '@/i18n'
    import { Notification } from 'element-ui'
    import NavBar from '@/views/common/NavBar'
    import { templateApi } from '@/api/templateApi'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import LayoutSelect from '@/views/common/LayoutSelect'
    import { getLayoutsWithPrimaryColor } from '@/helpers/layoutUtil'
    import TemplatesPreview from '@/views/DashboardCreation/components/TemplatesPreview'
    import TemplateCategories from '@/views/DashboardCreation/components/TemplateCategories'
    
    export default {
        components: {
            TemplateCategories,
            TemplatesPreview,
            LayoutSelect,
            NavBar,
        },
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
            }
        },
        computed: {
            selectedCategory() {
                return this.dashboardTemplateCategories.find(category => category.DashboardTemplateCategoryID.toString() === this.dashboardTemplateCategory.DashboardTemplateCategoryID.toString())
            },
            dashboardLayoutID() {
                return get(this.activeDashboard, 'DashboardLayoutID', DEFAULT_LAYOUT_ID);
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
            activeLanguage() {
                return this.$store.state.lang.language
            },
        },
        methods: {
            onChoseLayout(layout) {
                this.model.DashboardLayoutID = layout.LayoutID
            },
            onChooseCategory(category) {
                this.dashboardTemplateCategory = category
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
            onCancel() {
                return this.$router.push('/')
            },
            async onSubmit() {
                this.loading = true
                await this.$store.dispatch('dashboards/createDashboard', {
                    ...this.model,
                    AccountID: this.currentAccountId,
                })
                Notification.success(i18n.t('Dashboard added with success.'))
                this.loading = false
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
        },
        created() {
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

.dashboard-creation ::v-deep {
    .el-loading-mask {
        position: absolute;
        height: 100%;
        left: 0%;
    }
}
</style>
