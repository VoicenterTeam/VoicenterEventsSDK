<template>
    <div class="content-wrapper leading-5 text-sm font-normal text-gray-950">
        <div class="w-60 mb-5 flex flex-col items-start">
            <div class="report-label">
                {{ $t('report.name') }}
            </div>
            <el-input
                v-model="model.ReportTriggerName"
                :placeholder="$t('report.name')"
                type="text"
            />
        </div>
        <div class="flex justify-between mb-8">
            <div class="flex">
                <div
                    class="flex flex-col w-38 items-start trigger"
                >
                    <span class="mb-2">
                        {{ $t('report.frequency') }}:
                    </span>
                    <base-select
                        v-model="model.ReportTriggerTypeID"
                        labelKey="ReportTriggerTypeName"
                        valueKey="ReportTriggerTypeID"
                        :multiple="false"
                        :filterable="false"
                        :data="reportTriggerTypeList"
                        @change="onChangeFrequency"
                    >
                        <template v-slot:prefix>
                            <component
                                class="text-primary w-4 h-4 mt-1-5"
                                :class="$rtl.isRTL ? 'mr-1' : 'ml-1'"
                                :is="model.icon"
                            />
                        </template>
                    </base-select>
                </div>
                <div class="transition flex flex-wrap items-start" v-if="showTriggerComponents">
                    <component
                        v-for="(component, index) in activeTrigger"
                        :is="getComponentName(component)"
                        :key="index"
                        @change="onChange"
                        class="trigger-component"
                        v-bind="component"
                        :label="component.TriggerParameterTag"
                        :isClickedOnNextBtn="clickedOnNextBtn"
                    />
                </div>
            </div>
        </div>
        <Conditions :reportItemData="reportItemData" :reportData="getReportDataByStep" />
        <portal to="next-button">
            <base-button
                fixed-width="w-37"
                type="primary"
                @click="goNext"
            >
                <div class="flex items-center">
                    <span class="mx-1 text-base font-bold">
                        {{ $t('general.next') }}
                    </span>
                    <IconDirRight class="mx-1" />
                </div>
            </base-button>
        </portal>
    </div>
</template>
<script>

    export default {
        props: {
            reportItemData: {
                type: Object,
                default: () => ({})
            },
            reportId: {
                type: Number
            }
        },
        components: {
            TimeRange: () => import('@/modules/common/components/form/TimeRange'),
            Interval: () => import('@/modules/common/components/form/Interval'),
            Conditions: () => import('@/modules/reports/components/schedule/components/Conditions'),
            Date: () => import('@/components/Widgets/BaseDate'),
            DayOfTheWeek: () => import('@/modules/common/components/form/DayOfTheWeek'),
            InputText: () => import('@/modules/common/components/form/InputText'),
            InputNumber: () => import('@/modules/common/components/form/InputNumber'),
            UserSelect: () => import('@/modules/common/components/form/UserSelect'),
            AccountSelect: () => import('@/modules/common/components/form/AccountSelect'),
            DayOfMonth: () => import('@/modules/common/components/form/DayOfMonth')
        },
        data () {
            return {
                model: {
                    ReportTriggerTypeID: null,
                    ReportTriggerName: null
                },
                showTriggerComponents: true,
                clickedOnNextBtn: false
            }
        },
        computed: {
            reportTriggerTypeList() {
                return this.$store.getters['reportTrigger/getConfData'].ReportTriggerTypeList
            },
            activeTrigger () {
                if (!this.model.ReportTriggerTypeID) {
                    return
                }
                const reportTriggerParameters = this.reportTriggerTypeList.find(el => el.ReportTriggerTypeID === this.model.ReportTriggerTypeID).ReportTriggerParameters
                return reportTriggerParameters.sort((a, b) => a.ParameterOrder - b.ParameterOrder)
            },
            getReportDataByStep () {
                return this.$store.getters['reportTrigger/getReportDataByStep']('ReportTriggerCondition')
            },
            getReportData () {
                return this.$store.getters['reportTrigger/getReportData']
            }
        },
        methods: {
            async onChangeFrequency (val) {
                const copyOfModel = JSON.parse(JSON.stringify(this.model))
                await this.$store.dispatch('reportTrigger/updateReportDataScheduleSettings', {})
                this.model = {
                    ReportTriggerTypeID: null,
                    ReportTriggerName: null
                }
                this.model.ReportTriggerTypeID = val
                this.model.ReportTriggerName = copyOfModel.ReportTriggerName
                this.showTriggerComponents = false
                this.$nextTick(() => {
                    this.showTriggerComponents = true
                })

                this.clickedOnNextBtn = false
            },
            goNext() {
                this.clickedOnNextBtn = true
                const isScheduleFieldsNotEmpty = () => {
                    const haveTriggerComponent = Object.keys(this.model).filter(field => !field.includes('ReportTrigger'))
                    const allFieldsValid = Object.entries(this.model)
                        .filter(field => !field[0].includes('ReportTrigger'))
                        .every(field => field[1])

                    return haveTriggerComponent.length === this.activeTrigger.length && allFieldsValid
                }
                const isConditionGroupsFieldsNotEmpty = () => {
                    return this.getReportData.ReportTriggerCondition.map(field => {
                        return field.ReportTriggerConditionFilter.every(el => {
                            if (this.checkIfValueIsEmpty(el.WidgetID)) {
                                return true
                            }
                            const isAdditionalFieldsNotEmpty = this.checkIfValueIsEmpty(el.WidgetTemplateColumnID) ||
                                this.checkIfValueIsEmpty(el.ConditionFilterValue) ||
                                this.checkIfValueIsEmpty(el.ConditionFilterOperatorID) ||
                                this.checkIfValueIsEmpty(el.ConditionFilterColumnTypeID)

                            if (el.WidgetID && isAdditionalFieldsNotEmpty) {
                                return false
                            }
                            if (Object.values(el).every(el => !this.checkIfValueIsEmpty(el))) {
                                return true
                            }
                            return false
                        })
                    })
                }
                if (!isScheduleFieldsNotEmpty() || isConditionGroupsFieldsNotEmpty().some(el => !el)) {
                    return
                }

                const objToEmit = {
                    nextStep: true
                }
                const data = {
                    ReportTriggerTypeID: this.model.ReportTriggerTypeID,
                    ReportTriggerName: this.model.ReportTriggerName,
                    ReportID: Number(this.$route.params.id) || this.reportId
                }

                this.$store.dispatch('reportTrigger/updateReportData', data)
                delete this.model.ReportTriggerName
                delete this.model.ReportTriggerTypeID

                this.$store.dispatch('reportTrigger/updateReportDataScheduleSettings', this.model)
                this.$emit('on-update', objToEmit)
            },
            getComponentName (component) {
                const componentTag = component.ComponentTag

                if (componentTag === 'Time') {
                    return 'Interval'
                } else if (componentTag === 'Text') {
                    return 'InputText'
                } else if (componentTag === 'Number') {
                    return 'InputNumber'
                } else {
                    return componentTag
                }
            },
            onChange (item) {
                this.model[item.component.ParameterTag] = item.value
            },
            checkIfValueIsEmpty (value) {
                return value === '' || value === null
            }
        },
        mounted () {
            this.model = {
                ReportTriggerTypeID: this.getReportData.ReportTriggerTypeID,
                ReportTriggerName: this.getReportData.ReportTriggerName ? this.getReportData.ReportTriggerName : this.$t('report.name')
            }
            if (this.getReportData.ScheduleData && Object.keys(this.getReportData.ScheduleData).length) {
                Object.assign(this.model, this.getReportData.ScheduleData)
            }
            if (this.reportTriggerTypeList && !Object.keys(this.getReportData.ScheduleData).length) {
                this.model.ReportTriggerTypeID = this.reportTriggerTypeList[0].ReportTriggerTypeID
            }
        }
    }
</script>
<style lang="scss" scoped>
.menu-wrapper {
    @apply z-50 rounded bg-white mt-12 absolute w-40 flex flex-col origin-top-right right-0 shadow-base;
}

.is-expanded {
    transform: rotate(-180deg);
}

.transition {
    transition: all 0.3s ease-out;
}

.active {
    @apply bg-primary text-white border-primary;
}
[dir="rtl"] .trigger-component:not(:last-child) {
    @apply ml-10;
}

[dir="ltr"] .trigger-component:not(:last-child) {
    @apply mr-10;
}
.el-range-editor.is-active, .el-range-editor.is-active {
    @apply border-primary;
}
.report-label {
    @apply mb-3;
}
[dir="rtl"] .report-label {
    @apply ml-3;
}
[dir="ltr"] .report-label {
    @apply mr-3;
}
[dir="rtl"] .trigger {
    @apply ml-10;
}
[dir="ltr"] .trigger {
    @apply mr-10;
}
.interval ::v-deep .el-date-editor.el-input, .interval ::v-deep .el-date-editor.el-input__inner {
    @apply w-32;
}
</style>

<style lang="scss">
.trigger-component .el-input, .trigger-component .el-input-number {
    @apply w-32;
}
.time-picker .el-date-editor.el-input__inner {
    @apply w-32;
}

.el-time-range-picker {
    .el-time-panel__footer {
        height: 40px !important;

        .el-time-panel__btn.confirm {
            color: white !important;
            background: var(--primary-color) !important;
            border: 1px solid var(--primary-color) !important;
            border-radius: 4px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;

            &:hover {
                opacity: 0.75 !important;
            }
        }

        .el-time-panel__btn.cancel {
            border: 2px solid var(--gray-550) !important;
            border-radius: 4px !important;
            padding-left: 16px !important;
            font-weight: 700 !important;
            color: var(--gray-550) !important;
            padding-right: 16px !important;

            &:hover {
                background: var(--gray-200) !important;
            }
        }
    }
}
</style>
