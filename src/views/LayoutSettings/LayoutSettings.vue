<template>
    <div class="flex w-full flex-col relative layout-settings">
        <div class="w-full flex flex-col relative">
            <NavBar/>
            <div class="w-full px-4 lg:16 2xl:px-40 3xl:px-64 border-b border-gray-300">
                <div class="items-center flex justify-between h-23-5 relative">
                    <div class="flex items-center xl:-mx-24 w-full">
                        <div class="flex items-center">
                            <div @click="onDiscard(true)"
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
                            <IconColorPicker class="w-10 h-10 text-primary"/>
                            <div class="flex flex-col mx-2"
                                 v-if="!editableTitle">
                            <span class="text-xl font-bold text-gray-900">
                                {{ layoutSettings.LayoutName }}
                            </span>
                                <div class="flex items-center text-primary-300 hover:text-primary cursor-pointer"
                                     @click="onEditLayoutTitle">
                                    <IconPencil class="w-4 h-4"/>
                                    <span class="text-sm mx-1">{{ $t('common.edit') }}</span>
                                </div>
                            </div>
                            <div v-else
                                 class="flex flex-col mx-2">
                                <base-outline-input id="layout_name"
                                            class="text-xl font-bold"
                                            @on-enter="onEditLayoutTitle"
                                            v-model="layoutSettings.LayoutName">
                                    <IconCheck class="hover:text-primary cursor-pointer"
                                               @click="onEditLayoutTitle"/>
                                </base-outline-input>
                            </div>
                        </div>
                    </div>
                    <div class="hidden sm:flex flex-row items-center w-64">
                        <LayoutSelect
                            :active-layout="selectedLayout"
                            :display-label="false"
                            @on-chose-layout="onChoseLayout"/>
                    </div>
                </div>
            </div>
            <div class="w-full mt-6 px-4 lg:16 2xl:px-40 3xl:px-64">
                <div class="flex flex-row items-center w-full md:hidden mb-6">
                    <LayoutSelect :active-layout="selectedLayout"
                                  :display-label="false"
                                  @on-chose-layout="onChoseLayout"/>
                </div>
                <div class="lg:grid lg:grid-cols-5 gap-8">
                    <div class="col-span-2">
                        <LayoutWrapper v-model="layoutSettings"/>
                    </div>
                    <div class="col-span-3">
                        <LayoutPreview @on-real-time-preview="onRealTimePreview">
                            <template v-slot:actions>
                                <div class="grid grid-cols-1 mt-8">
                                    <div class="col-span-1 flex justify-end">
                                        <base-button @click="onDiscard(true)"
                                            variant="discard"
                                            fixed-width="w-37">
                                            <div class="flex items-center">
                                                <IconDiscard class="mx-1"/>
                                                <span class="mx-1 text-base font-bold">{{ 'Discard' }}</span>
                                            </div>
                                        </base-button>
                                        <div class="mx-2"/>
                                        <base-button
                                            fixed-width="w-37"
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
        <ConfirmDialog
            :visible.sync="showConfirmDialog"
            modalWidth="456px">
            <template v-slot:title>
                <h3 class="text-xl font-bold text-gray-950">
                    {{ isDefaultLayout ? $t('layout.saveLayout') : $t('general.saveChanges') }}
                </h3>
            </template>
            <div v-if="!isDefaultLayout" class="py-8">
                <div class="mb-5">
                    <BaseRadioButton
                        v-model="layoutForm.typeOfTheme"
                        group-name="group1"
                        value="newTheme"
                        checked
                    >
                        {{ $t('layout.saveAsANew') }}
                    </BaseRadioButton>
                </div>
                <div class="ml-6 mb-11" :class="{ 'disabled-block': layoutForm.typeOfTheme !== 'newTheme'}">
                    <div class="flex items-center mb-3">
                        <div class="flex">
                            <IconExtensionsTable class="text-primary mr-2 icon"/>
                            <div class="text font-normal">{{ $t('layout.newThemeName') }}</div>
                        </div>
                    </div>
                    <el-form :model="layoutForm" ref="layoutForm">
                        <div>
                            <el-form-item
                                prop="layoutName"
                                :rules="rules.layoutName">
                                <el-input
                                    v-model="layoutForm.layoutName"
                                    :placeholder="$t('layout.newThemeName')"
                                    class="new-theme-input"
                                    :disabled="layoutForm.typeOfTheme !== 'newTheme'"
                                />
                                <span class="el-form-item__error" slot="error" slot-scope="error">&nbsp;{{ error.error }}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <BaseRadioButton
                    v-model="layoutForm.typeOfTheme"
                    group-name="group1"
                    value="existingTheme"
                >
                    {{ $t('layout.saveChangesToExistingTheme') }}
                </BaseRadioButton>
            </div>
            <div v-else class="py-8">
                <div class="flex items-center mb-3">
                    <div class="flex">
                        <IconExtensionsTable class="text-primary mr-2 icon"/>
                        <div class="text font-normal">{{ $t('layout.newThemeName') }}</div>
                    </div>
                </div>
                <el-form :model="layoutForm" ref="layoutForm">
                    <div>
                        <el-form-item
                            prop="layoutName"
                            :rules="rules.layoutName">
                            <el-input
                                v-model="layoutForm.layoutName"
                                :placeholder="$t('layout.newThemeName')"
                                class="new-theme-input"
                            />
                            <span class="el-form-item__error" slot="error" slot-scope="error">&nbsp;{{ error.error }}</span>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <template v-slot:footer-actions>
                <div class="w-full flex items-center justify-center">
                    <slot name="footer-actions">
                        <base-button class="mr-4"
                            @click="showConfirmDialog = false"
                            variant="discard"
                            fixed-width="w-30" size="lg">
                            <div class="flex items-center">
                                <IconDiscard class="mx-1" v-if="isDefaultLayout" />
                                <span class="font-semibold">{{ $t('common.cancel') }}</span>
                            </div>
                        </base-button>
                        <base-button
                            class="ml-4"
                            @click="onNewLayout"
                            key="new-layout"
                            fixed-width="w-30"
                            :loading="storingData" size="lg"
                            :disabled="disabledForm">
                            <span class="font-semibold">
                                {{ $t('Apply') }}
                            </span>
                        </base-button>
                    </slot>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import { LayoutApi } from '@/api/layoutApi'
    import NavBar from '@/views/common/NavBar'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { AlertTriangleIcon } from 'vue-feather-icons'
    import DeleteLayout from '@/views/common/DeleteLayout'
    import LayoutSelect from '@/views/common/LayoutSelect'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import LayoutPreview from '@/views/LayoutSettings/LayoutPreview'
    import LayoutWrapper from '@/views/DashboardSettings/LayoutManagement/parts/LayoutWrapper'
    import BaseRadioButton from '@/components/BaseRadioButton'

    export default {
        components: {
            NavBar,
            ConfirmDialog,
            LayoutSelect,
            DeleteLayout,
            LayoutPreview,
            LayoutWrapper,
            AlertTriangleIcon,
            BaseRadioButton
        },
        data() {
            let validationThemeName = (rule, value, callback) => {
                const validationThemeName = this.layoutNames.includes(value)
                if (validationThemeName) {
                    callback(new Error(''))
                } else {
                    callback()
                }
            }
            return {
                updatingData: false,
                storingData: false,
                editableTitle: false,
                layoutSettings: {},
                showConfirmDialog: false,
                realTimePreview: true,
                layoutForm: {
                   layoutName: '',
                   typeOfTheme: 'newTheme'
                },
                rules: {
                    layoutName: [
                        { required: true, message: this.$t('general.validationRequired', { field: this.$t('layout.newThemeName') }) },
                        { validator: validationThemeName, message: this.$t('layout.layoutNameAlreadyUsedWarning') }
                    ]
                },
                disabledForm: !this.isDefaultLayout,
                selectedLayout: {}
            }
        },
        computed: {
            allLayouts() {
                return this.$store.getters['layout/getAllLayouts']
            },
            layoutNames() {
                return this.allLayouts.map(layout => layout.LayoutName)
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
            }
        },
        methods: {
            onChoseLayout(layout) {
                this.layoutSettings = cloneDeep(layout)
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
                    this.$nextTick(() => {
                        this.$router.push('dashboard-settings')
                    })
                }
            },
            composePayload() {
                if (this.isDefaultLayout) {
                    delete this.layoutSettings.LayoutID
                }
                return {
                    ...this.layoutSettings,
                    LayoutStatusID: 1,
                    LayoutStatusName: 'Enable',
                    LayoutAccountID: this.currentAccountId,
                }
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
                    this.editableTitle = false
                    this.$router.push('/dashboard-settings')
                }
            },
            async onNewLayout() {
                if (this.layoutForm.typeOfTheme === 'newTheme') {
                    let payload = {}
                    try {
                        this.storingData = true
                        payload = this.composePayload()
                        payload.LayoutName = this.layoutForm.layoutName
                        delete payload.LayoutID
                        const { LayoutID } = await LayoutApi.update(payload)
                        payload.LayoutID = LayoutID
                    } catch (e) {
                        console.warn(e)
                    } finally {
                        this.storingData = false
                        this.showConfirmDialog = false
                        this.selectedLayout = payload
                        this.layoutSettings = this.selectedLayout
                        this.$store.commit('layout/SET_ACTIVE_LAYOUT', payload)
                        this.$store.dispatch('layout/setupLayouts')
                        this.$store.dispatch('layout/getGlobalLayout')
                    }
                } else {
                    await this.onUpdateLayout()
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
                this.$store.dispatch('layout/getGlobalLayout')
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
            validateForm () {
                this.$refs.layoutForm.validate((valid) => {
                    if (valid) {
                        this.disabledForm = false
                    } else {
                        this.disabledForm = true
                        return false
                    }
                })
            }
        },
        mounted() {
            this.selectedLayout = this.$store.getters['layout/getActiveLayout']
            this.layoutSettings = cloneDeep(this.selectedLayout)
        },
        watch: {
            layoutSettings: {
                deep: true,
                handler() {
                    this.triggerLayoutChanges()
                },
            },
            showConfirmDialog () {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.layoutForm.resetFields()
                        this.layoutForm.typeOfTheme = 'newTheme'
                        this.disabledForm = true
                    }, 150)
                })
            },
            layoutForm: {
                handler (val) {
                    if (!this.showConfirmDialog) {
                        return
                    }

                    if (val.typeOfTheme !== 'existingTheme') {
                        this.validateForm()
                        this.$refs.layoutForm.clearValidate()
                    } else {
                        this.$refs.layoutForm.resetFields()
                        this.disabledForm = false
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
.new-theme-input ::v-deep .el-input__inner {
    @apply text-sm font-normal;
}
.disabled-block .icon, .disabled-block .text {
    @apply text-gray-550 transition duration-300;
}
</style>
