<template>
    <div>
        <el-form @submit.native.prevent="onSubmit"
                 v-loading="loading">
            <div class="flex w-full items-center justify-between my-10">
                <span class="text-xl font-bold text-gray-900">
                    {{ model.ReportID ? `${$t('Edit Report')} #${model.ReportID }`: $t('Report Creation')}}
                </span>
                <div class="flex">
                    <base-button :class="$rtl.isRTL ? 'mx-4' : 'mx-4'"
                                 @click="onCancel()"
                                 variant="discard"
                                 fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-semibold">{{ $t('Cancel') }}</span>
                        </div>
                    </base-button>
                    <base-button
                        :loading="loading"
                        @click="onSubmit()">
                        <div class="flex items-center">
                            <IconSave class="mx-1"/>
                            <span class="mx-1 text-base font-semibold">{{ $t('Save Changes') }}</span>
                        </div>
                    </base-button>
                </div>
            </div>
            <div class="form-header rounded-md p-8 md:grid md:grid-cols-3 gap-6 shadow-base text">
                <div class="col-span-1">
                    <label class="flex items-center mb-2">
                        <IconReportName class="text-primary mb-0-5"/>
                        <span class="mx-1 text-main-sm text-gray-950">
                            {{ $t('Report Name') }}
                        </span>
                    </label>
                    <el-input v-model="model.ReportName"
                              :placeholder="$t('Report Name')"
                              id="name"/>
                </div>
                <div class="col-span-1 flex-1 w-full">
                    <label for="type-name" class="flex items-center mb-2">
                        <IconReportColumn class="w-4 h-4 text-primary"/>
                        <span class="mx-1 text-main-sm text-gray-950">
                            {{ $t('Report Type Name') }}
                        </span>
                    </label>
                    <el-input v-model="model.ReportTypeName"
                              :placeholder="$t('Report Type Name')"
                              id="type-name"/>
                </div>
                <div class="col-span-1 flex-1 w-full">
                    <label class="flex items-center mb-4">
                        <IconCondition class="w-4 h-4 text-primary"/>
                        <span class="mx-1 text-main-sm text-gray-950">
                            {{ $t('Report Status') }}
                        </span>
                    </label>
                    <el-switch :value="reportStatus()"
                               active-color="var(--primary-color)"
                               inactive-color="var(--steel)"
                               @change="onChangeReportStatus($event)"
                    />
                </div>
            </div>
        </el-form>
        <ReportElements :report="report"/>
    </div>
</template>
<script>
    import { Switch } from 'element-ui'
    import { reportApi } from '@/modules/reports/services/reportService'
    import ReportElements from '@/modules/reports/components/report-form/ReportElements'
    import { STATUS_IDS, STATUS_NAMES, STATUS_VALUES } from '@/modules/reports/enum/report'
    
    export default {
        components: {
            ReportElements,
            [Switch.name]: Switch,
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
                    ReportName: '',
                    ReportStatusID: 1,
                    ReportTypeID: 1, //Check available options
                    ReportTypeName: '',
                    ReportItemList: [],
                    ReportTriggerList: [],
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
                        return await reportApi.update(this.model)
                    }
                    this.model['AccountID'] = this.currentAccountId
                    const { ReportID } = await reportApi.store(this.model)
                    console.log({ ReportID })
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                }
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
