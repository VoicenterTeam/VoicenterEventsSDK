<template>
    <div class="report-edit">
        <div class="report-edit-container">
            <div class="report-edit-header">
                <div class="report-edit-header--title">
                    {{ $t('report.editPage.title') }}
                </div>
                <div class="flex">
                    <base-button
                        @click="onReportDelete"
                        type="danger"
                        outline
                        square
                        size="md"
                        class="report-edit-header--button report-edit-header--button-delete"
                    >
                        <template v-slot:icon>
                            <IconDelete />
                        </template>
                    </base-button>
                    <base-button
                        outline
                        fixed-width="w-37"
                        @click="onModalConfirm"
                        class="report-edit-header--button"
                    >
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ $t('common.cancel') }}</span>
                        </div>
                    </base-button>
                    <base-button
                        @click="saveChanges"
                        data-test-name="wizard-finish"
                        type="primary"
                        class="report-edit-header--button"
                    >
                        <IconSave class="mx-2" />
                        {{ $t('general.saveChanges') }}
                    </base-button>
                </div>
            </div>
            <div class="report-edit-fields">
                <div class="report-edit-fields-item">
                    <div class="report-label">
                        <i class="vc-icon-settings label-icon text-primary" />{{ $t('report.name') }}<span class="require-icon">*</span>
                    </div>
                    <el-input
                        v-model="report.ReportName"
                        :placeholder="$t('report.name')"
                        type="text"
                    />
                    <div class="el-form-item__error" v-show="clickedOnSaveBtn && checkIfValueIsEmpty(report.ReportName)">
                        {{ $t('validation.error.fieldIsRequired') }}
                    </div>
                </div>
                <div class="report-edit-fields-item">
                    <div class="report-label">
                        <i class="vc-icon-real-time label-icon text-primary" /> {{ $t('report.status') }}
                    </div>
                    <div class="flex items-center h-10">
                        <el-switch
                            v-model="report.ReportStatusID"
                            :active-text="report.ReportStatusID === 1 ? $t('report.wizard.enabled') : $t('report.switch.disable')"
                            inactive-text=""
                            :active-value="1"
                            :inactive-value="2" />
                    </div>
                </div>
            </div>
            <div class="report-edit-tabs">
                <tab-card
                    :data="dataTabs"
                    :active-tab.sync="activeTab"
                    class="border-t md:border-0 mt-7"
                    data-test-name="report-item--edit"
                    :white-bg="true"
                >
                    <template slot="widgets">
                        <wrapper-widget-table showReorderButton class="p-8" />
                    </template>
                    <template slot="schedule-list">
                        <schedule-list />
                    </template>
                </tab-card>
            </div>
        </div>
        <delete-dialog
            v-if="showDeleteDialog"
            :visible.sync="showDeleteDialog"
            :config="{descriptionIcon: ''}"
            :description="$t('report.deleteReportConfirmation')"
            @on-close="onCancelDelete"
            @on-cancel="onCancelDelete"
            @on-confirm="deleteReport"
        />
        <confirm-dialog
            v-if="showConfirmDialog"
            :visible.sync="showConfirmDialog"
            :config="{descriptionIcon: ''}"
            :description="$t('common.confirm.question', { action: 'confirm' })"
            @on-close="cancel"
            @on-cancel="cancel"
            @on-confirm="onCancelConfirm"
        />
    </div>
</template>

<script>
import { reportApi } from '@/modules/reports/services/reportService'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

const REPORT_DISABLED_STATUS = 2

export default {
    name: 'edit-report-page',
    components: {
        DeleteDialog: () => import('@/components/Dialogs/DeleteDialog'),
        ConfirmDialog: () => import('@/components/Dialogs/ConfirmDialog'),
        ScheduleList: () => import('@/modules/reports/components/ScheduleList.vue'),
        TabCard: () => import('@/modules/reports/components/TabCard.vue'),
        WrapperWidgetTable: () => import('@/modules/reports/components/WrapperWidgetTable.vue')
    },
    props: {
        report: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            showDeleteDialog: false,
            reportToDelete: null,
            showConfirmDialog: false,
            copyOfReportData: null,
            activeTab: 'widgets',
            dataTabs: [
                {
                    title: this.$t('widget.widgets'),
                    name: 'widgets',
                    icon: 'vc-icon-settings'
                },
                {
                    title: this.$t('report.schedules'),
                    name: 'schedule-list',
                    icon: 'vc-icon-ivrs'
                }
            ],
            clickedOnSaveBtn: false
        }
    },
    computed: {
        getReportData () {
            return this.$store.getters['report/getReportData']
        }
    },
    watch: {
        'report.ReportName' (val) {
            const data = {
                ReportName: val
            }
            this.$store.dispatch('report/updateReportData', data)
        },
        'report.ReportStatusID' (val) {
            const data = {
                ReportStatusID: val
            }
            this.$store.dispatch('report/updateReportData', data)
        }
    },
    methods: {
        onReportDelete () {
            this.reportToDelete = this.$route.params.id
            if (!this.reportToDelete) return
            this.showDeleteDialog = true
        },
        async deleteReport() {
            try {
                await this.$store.dispatch('dashboards/setContentLoading', true)
                const payload = {
                    ReportID: this.reportToDelete,
                    ReportStatusID: REPORT_DISABLED_STATUS
                }
                await reportApi.changeStatus(payload)
                this.reportToDelete = null
                this.showDeleteDialog = false
            } catch (err) {
                console.error(err)
            } finally {
                await this.$store.dispatch('dashboards/setContentLoading', false)
                this.$emit('on-reload-data-reports-list')
            }
        },
        onCancelDelete() {
            this.reportToDelete = null
            this.showDeleteDialog = false
        },
        onModalConfirm () {
            const reportHasNotChanges = isEqual(this.copyOfReportData, this.getReportData)
            if (reportHasNotChanges) {
                this.$emit('on-cancel')
            } else {
                this.showConfirmDialog = true
            }
        },
        onCancelConfirm () {
            this.$emit('on-cancel')
        },
        cancel() {
            this.showConfirmDialog = false
        },
        saveChanges () {
            this.clickedOnSaveBtn = true
            if (this.checkIfValueIsEmpty(this.getReportData.ReportName)) {
                return
            }
            try {
                reportApi.update(this.getReportData)
            } finally {
                this.clickedOnSaveBtn = false
            }
        },
        checkIfValueIsEmpty (value) {
            return value === '' || value === null
        }
    },
    async mounted () {
        await this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', true)
        await this.$store.dispatch('report/updateReportData', this.report)
        this.copyOfReportData = cloneDeep(this.getReportData)
    },
    async beforeDestroy () {
        await this.$store.dispatch('reportTrigger/updateValueOfCreateLocalReportTrigger', false)
        await this.$store.dispatch('report/resetReportData')
    }
}
</script>

<style lang="scss" scoped>
.report-label {
    @apply mb-2 flex items-center;
}
.report-edit {
    &-header {
        @apply my-9 flex items-center justify-between;
        &--title {
            @apply text-gray-950 text-2xl;
        }
        [dir="ltr"] &--button:not(:last-child){
            @apply mr-8;
        }
        [dir="rtl"] &--button:not(:last-child) {
            @apply ml-8;
        }
        &--button-delete {
            @apply h-10 w-10;
        }
        &--button {
            @apply h-10;
        }
    }
    &-fields {
        @apply flex flex-wrap shadow-base rounded-md bg-white px-8 pt-6 pb-10 mb-6;
        &-item {
            max-width: 392px;
            width: 100%;
            @apply mb-2 relative;
        }
        [dir="ltr"] &-item:not(:last-child) {
            @apply mr-8;
        }
        [dir="rtl"] &-item:not(:last-child) {
            @apply ml-8;
        }
    }
}
[dir="rtl"] .require-icon {
    @apply text-primary mr-2;
}
[dir="ltr"] .require-icon  {
    @apply text-primary ml-2;
}
.el-form-item__error {
    @apply pt-2;
}
[dir="rtl"] .label-icon {
    @apply ml-2;
}
[dir="ltr"] .label-icon  {
    @apply mr-2;
}
::v-deep .el-switch__label.is-active {
    @apply text-primary;
}
::v-deep .el-switch.is-checked .el-switch__core {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
}
</style>

<style lang="scss">
[dir="rtl"] .report-edit .el-switch__label {
    @apply mr-2;
}
[dir="ltr"] .report-edit .el-switch__label {
    @apply ml-2;
}
</style>