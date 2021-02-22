<template>
    <div class="flex w-full flex-col relative layout-settings">
        <div class="w-full flex flex-col relative">
            <NavBar/>
            <div class="w-full px-4 lg:px-32 xxl:px-64 border-b border-gray-300">
                <div class="items-center flex justify-between h-23-5 relative">
                    <div class="flex items-center xl:-mx-24 w-full">
                        <div @click="onDiscard(true)"
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
                        <IconColorPicker class="w-10 h-10 text-primary"/>
                        <div class="flex flex-col mx-2"
                             v-if="!editableTitle">
                            <span class="text-xl font-bold text-gray-900">
                                {{ layoutSettings.LayoutName }}
                            </span>
                            <div class="flex items-center text-primary-300 hover:text-primary cursor-pointer"
                                 @click="onEditLayoutTitle">
                                <IconPencil class="w-4 h-4"/>
                                <span class="text-sm mx-1">{{ $t('Edit') }}</span>
                            </div>
                        </div>
                        <div v-else
                             class="flex flex-col mx-2">
                            <base-input id="layout_name"
                                        class="text-xl font-bold"
                                        @on-enter="onEditLayoutTitle"
                                        v-model="layoutSettings.LayoutName">
                                <IconCheck class="hover:text-primary cursor-pointer"
                                           @click="onEditLayoutTitle"/>
                            </base-input>
                        </div>
                    </div>
                    <div class="flex flex-row items-center w-64">
                        <LayoutSelect :active-layout="selectedLayout"
                                      :display-label="false"
                                      @on-chose-layout="onChoseLayout"/>
                    </div>
                </div>
            </div>
            <div class="w-full px-4 mt-6 lg:px-20 xl:px-32 xxl:px-64">
                <div class="grid grid-cols-5 col-gap-8">
                    <div class="col-span-2">
                        <LayoutWrapper v-model="layoutSettings"/>
                    </div>
                    <div class="col-span-3">
                        <LayoutPreview @on-real-time-preview="onRealTimePreview">
                            <template v-slot:actions>
                                <div class="grid grid-cols-1 mt-8">
                                    <div class="col-span-1 flex justify-end">
                                        <base-button @click="onDiscard()"
                                                     variant="discard"
                                                     fixed-width="w-37">
                                            <div class="flex items-center">
                                                <IconDiscard class="mx-1"/>
                                                <span class="mx-1 text-base font-bold">{{ 'Discard' }}</span>
                                            </div>
                                        </base-button>
                                        <div class="mx-2"></div>
                                        <base-button fixed-width="w-37"
                                                     @click="onApply()">
                                            <div class="flex items-center">
                                                <IconSave class="mx-1"/>
                                                <span class="mx-1 text-base font-bold">{{ 'Apply' }}</span>
                                            </div>
                                        </base-button>
                                    </div>
                                </div>
                            </template>
                        </LayoutPreview>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmDialog :visible.sync="showConfirmDialog"
                       :description="getPromptDescription">
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ isDefaultLayout ? $t('Save Layout') : $t('Save Changes') }}
                </h3>
            </template>
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <base-button class="mx-4"
                                 v-if="isDefaultLayout"
                                 @click="showConfirmDialog = false"
                                 variant="discard"
                                 fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="font-semibold">{{ 'Cancel' }}</span>
                        </div>
                    </base-button>
                    <base-button @click="onNewLayout"
                                 key="new-layout"
                                 fixed-width="w-37"
                                 :variant="isDefaultLayout ? white: ''"
                                 :loading="storingData">
                        <span class="font-semibold">{{ $t('Save as New') }}</span>
                    </base-button>
                    <template v-if="!isDefaultLayout">
                        <base-button @click="onUpdateLayout"
                                     key="update-layout"
                                     fixed-width="w-37"
                                     :loading="updatingData">
                            <span class="font-semibold">{{ $t('Save Changes') }}</span>
                        </base-button>
                    </template>
                </slot>
            </template>
        </ConfirmDialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import {LayoutApi} from '@/api/layoutApi'
    import NavBar from '@/views/common/NavBar'
    import {DEFAULT_LAYOUT_ID} from '@/enum/generic'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import DeleteLayout from '@/views/common/DeleteLayout'
    import LayoutSelect from '@/views/common/LayoutSelect'
    import LayoutPreview from '@/views/LayoutSettings/LayoutPreview'
    import LayoutWrapper from '@/views/DashboardSettings/LayoutManagement/parts/LayoutWrapper'

    export default {
        components: {
            NavBar,
            ConfirmDialog,
            LayoutSelect,
            DeleteLayout,
            LayoutPreview,
            LayoutWrapper,
        },
        data() {
            return {
                updatingData: false,
                storingData: false,
                editableTitle: false,
                layoutSettings: {},
                showConfirmDialog: false,
                realTimePreview: true,
            }
        },
        computed: {
            selectedLayout() {
                return this.$store.getters['layout/getActiveLayout']
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
            getActiveDashboardLayoutID() {
                return get(this.$store.getters['dashboards/getActiveDashboard'], 'DashboardLayoutID', 1)
            },
            storedDashboardLayout() {
                return this.$store.getters['layout/storedDashboardLayout'](this.getActiveDashboardLayoutID)
            },
            isDefaultLayout() {
                return this.layoutSettings.LayoutID === DEFAULT_LAYOUT_ID
            },
            getPromptDescription() {
                if (this.isDefaultLayout) {
                    return this.$t('Are you sure you want to create new Layout?')
                }
                return this.$t('Do you want to save changes in the existing theme or save as a new?')
            }
        },
        methods: {
            onChoseLayout(layout) {
                this.layoutSettings = layout
                this.$store.commit('layout/SET_ACTIVE_LAYOUT', layout)
            },
            onRealTimePreview(state) {
                this.realTimePreview = state
                this.triggerLayoutChanges()
            },
            onApply() {
                this.showConfirmDialog = true
            },
            onDiscard(goBack = false) {
                this.layoutSettings = cloneDeep(this.storedDashboardLayout)
                this.$store.dispatch('layout/updateActiveLayout', this.layoutSettings)
                if (goBack) {
                    this.$router.push('dashboard-settings')
                }
            },
            composePayload() {
                const payload = {
                    ...this.layoutSettings,
                    LayoutStatusID: 1,
                    LayoutStatusName: 'Enable',
                    LayoutAccountID: this.currentAccountId,
                }
                return payload
            },
            async onUpdateLayout() {
                try {
                    this.updatingData = true
                    const payload = this.composePayload()
                    await LayoutApi.update(payload)
                    await this.updateDashboardLayout(payload)
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.updatingData = false
                    this.showConfirmDialog = false
                }
            },
            async onNewLayout() {
                try {
                    this.storingData = true
                    let payload = this.composePayload()
                    delete payload.LayoutID
                    await LayoutApi.update(payload)
                    await this.getAccountLayouts()
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                    this.showConfirmDialog = false
                }
            },
            async getAccountLayouts() {
                try {
                    let accountSettings = {
                        LayoutAccountID: this.currentAccountId,
                    }
                    const data = await LayoutApi.get(accountSettings)
                    const newLayout = data[data.length - 1]
                    return await this.updateDashboardLayout(newLayout)
                } catch (e) {
                    console.warn(e)
                }
            },
            async updateDashboardLayout(layout) {
                await this.$store.dispatch('dashboards/updateDashboardLayout', layout.LayoutID)
                this.$store.commit('layout/SET_ACTIVE_LAYOUT', layout)
                this.showConfirmDialog = false
                this.$store.dispatch('layout/setupLayouts')
            },
            onEditLayoutTitle() {
                this.editableTitle = !this.editableTitle
                if (this.editableTitle) {
                    this.$nextTick(() => {
                        const LayoutNameInput = document.querySelector('#layout_name input')
                        if (LayoutNameInput) {
                            LayoutNameInput.focus()
                        }
                    })
                }
            },
            triggerLayoutChanges() {
                this.$nextTick(() => {
                    if (this.realTimePreview) {
                        this.$store.dispatch('layout/updateActiveLayout', this.layoutSettings)
                    } else {
                        this.$store.dispatch('layout/updateActiveLayout', this.storedDashboardLayout)
                    }
                })
            },
        },
        mounted() {
            this.layoutSettings = cloneDeep(this.selectedLayout)
        },
        watch: {
            layoutSettings: {
                deep: true,
                handler() {
                    this.triggerLayoutChanges()
                },
            },
        },
    }
</script>
