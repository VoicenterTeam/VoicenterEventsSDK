<template>
    <div>
        <base-form layout="vertical"
                   class="mb-10 -mt-8"
        >
            <div class="col-span-3 md:col-span-1">
                <base-input rules="required"
                            :name="$t('report.reportName')"
                            :label="$t('report.reportName')"
                            label-icon="IconReportName"
                            v-model="model.ReportName"
                            id="ReportTypeName"
                />
            </div>
            <div class="col-span-3 md:col-span-1">
                <base-input rules="required"
                            :name="$t('report.reportTypeName')"
                            :label="$t('report.reportTypeName')"
                            label-icon="IconReportName"
                            v-model="model.ReportTypeName"
                            id="ReportName"
                />
            </div>
            <div class="col-span-3 md:col-span-1">
                <label class="flex items-center mb-4">
                    <IconCondition class="w-4 h-4 text-primary"/>
                    <span class="mx-1 text-main-sm text-gray-950">
                        {{ $t('report.reportStatus') }}
                    </span>
                </label>
                <el-switch :value="reportStatus()"
                           active-color="var(--primary-color)"
                           inactive-color="var(--steel)"
                           @change="onChangeReportStatus($event)"
                />
            </div>
            <template v-slot:header="{valid, handleSubmit}">
                <div class="flex items-center justify-between mb-10">
                    <span class="text-xl font-bold text-gray-900">
                        {{ model.ReportID ? `${$t('widget.editReport')} #${model.ReportID}` : $t('report.reportCreation') }}
                    </span>
                    <div class="flex">
                        <cancel-button
                            class="mx-4"
                            @on-click="onCancel"
                        />
                        <confirm-button
                            :label="this.$t('Save')"
                            icon="IconSave"
                            @on-click="handleSubmit(onSubmit)"
                        />
                    </div>
                </div>
            </template>
        </base-form>
        <ReportElements @item-upsert="onItemUpsert"
                        @schedules-upsert="onSchedulesUpsert"
                        @update-operation="onUpdateOperation"
                        :report="report"/>
    </div>
</template>
<script>
    import { delay } from '@/helpers/util'
    import BaseForm from '@/modules/common/components/form/BaseForm'
    import BaseInput from '@/modules/common/components/form/BaseInput'
    import { reportApi } from '@/modules/reports/services/reportService'
    import ReportElements from '@/modules/reports/components/report-form/ReportElements'
    import { STATUS_IDS, STATUS_NAMES, STATUS_VALUES } from '@/modules/reports/enum/report'
    import CancelButton from "@/components/Common/Buttons/CancelButton"
    import ConfirmButton from "@/components/Common/Buttons/ConfirmButton";

    export default {
        components: {
            BaseForm,
            BaseInput,
            ReportElements,
            CancelButton,
            ConfirmButton,
        },
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                loading: false,
                model: {
                    ReportName: this.$t('report.newReport'),
                    ReportStatusID: 1,
                    ReportTypeID: 1, //Check available options
                    ReportTypeName: '',
                    ReportItemList: [],
                    ReportTriggerLis: [],
                    ReportTriggerRecipient: [],
                },
            }
        },
        computed: {
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
        },
        methods: {
            async onSubmit() {
                try {
                    this.loading = true
                    if (this.model.ReportID) {
                        const payload = {
                            ReportID: this.model.ReportID,
                            ReportName: this.model.ReportName,
                            ReportStatusID: this.model.ReportStatusID,
                            ReportTypeName: this.model.ReportTypeName,
                        }
                        await reportApi.update(payload)
                    } else {
                        this.model['AccountID'] = this.currentAccountId
                        const { ReportID } = await reportApi.store(this.model)
                        console.log({ ReportID })
                    }
                } catch (e) {
                    console.warn(e)
                } finally {
                    await delay(1000)
                    this.loading = false
                }
            },
            onUpdateOperation() {

            },
            onSchedulesUpsert(schedules) {
            },
            onCancel() {
                this.$emit('reset-state')
            },
            onChangeReportStatus(status) {
                const ReportStatusID = STATUS_IDS[status]
                const ReportStatusName = STATUS_NAMES[ReportStatusID]
                this.model = {
                    ...this.model,
                    ReportStatusID,
                    ReportStatusName,
                }
            },
            reportStatus() {
                return STATUS_VALUES[this.model.ReportStatusID]
            },
            onItemUpsert(items) {
                debugger
                console.log('here')
                this.model.ReportTriggerList = items
                this.$emit('on-update', {
                    ReportTriggerList: items
                })
            },
        },
        watch: {
            report: {
                deep: true,
                immediate: true,
                handler(value) {
                    if (!value.ReportID) {
                        return
                    }
                    this.model = {
                        ...value,
                    }
                },
            },
        },
    }
</script>
