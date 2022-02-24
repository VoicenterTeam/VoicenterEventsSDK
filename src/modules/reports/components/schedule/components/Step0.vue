<template>
    <div class="content-wrapper leading-5 text-sm font-normal text-gray-950">
        <div class="w-60 mb-5">
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
                <div class="flex flex-col w-38"
                     :class="$rtl.isRTL ? 'ml-10' : 'mr-10'">
                    <span class="mb-2">
                        {{ $t('report.Frequency') }}:
                    </span>
                    <base-select
                        v-model="model.ReportTriggerTypeID"
                        labelKey="ReportTriggerTypeName"
                        valueKey="ReportTriggerTypeID"
                        size="small"
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
    import BaseTimeRange from '@/modules/common/components/form/BaseTimeRange'
    import BaseInterval from '@/modules/common/components/form/BaseInterval'
    import BaseDate from '@/components/Widgets/BaseDate'
    import Conditions from '@/modules/reports/components/schedule/components/Conditions'
    import BaseDayOfTheWeek from '@/modules/common/components/form/BaseDayOfTheWeek'
    import BaseInputText from '@/modules/common/components/form/BaseInputText'
    import BaseInputNumber from '@/modules/common/components/form/BaseInputNumber'

    export default {
        props: {
            reportItemData: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            BaseTimeRange,
            BaseInterval,
            Conditions,
            BaseDate,
            BaseDayOfTheWeek,
            BaseInputText,
            BaseInputNumber
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
                return this.$store.getters['report/getConfData'].ReportTriggerTypeList
            },
            activeTrigger () {
                if (!this.model.ReportTriggerTypeID) {
                    return
                }
                const reportTriggerParameters = this.reportTriggerTypeList.find(el => el.ReportTriggerTypeID === this.model.ReportTriggerTypeID).ReportTriggerParameters
                return reportTriggerParameters.sort((a, b) => a.ParameterOrder - b.ParameterOrder)
            },
            getReportDataByStep () {
                return this.$store.getters['report/getReportDataByStep'](0)
            },
            getReportData () {
                return this.$store.getters['report/getReportData']
            }
        },
        methods: {
            async onChangeFrequency (val) {
                const copyOfModel = JSON.parse(JSON.stringify(this.model))
                await this.$store.dispatch('report/updateReportDataScheduleSettings', {})
                this.model = {}
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
                    return this.getReportData[0].map(field => {
                        return field.every(el => {
                            if (!el.WidgetID) {
                                return true
                            }
                            if (el.WidgetID && (!el.WidgetTemplateColumnID || !el.ConditionFilterValue || !el.ConditionFilterOperatorID || !el.ConditionFilterColumnTypeID)) {
                                return false
                            }
                            if (Object.values(el).every(el => el)) {
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
                    ReportTriggerName: this.model.ReportTriggerName
                }
                this.$store.dispatch('report/updateReportData', data)
                delete this.model.ReportTriggerName
                delete this.model.ReportTriggerTypeID

                this.$store.dispatch('report/updateReportDataScheduleSettings', this.model)
                this.$emit('on-update', objToEmit)
            },
            getComponentName (component) {
                const componentName = 'Base' + component.ParameterTypeName
                if (componentName === 'BaseTime' || componentName === 'BaseInterval') {
                    return 'BaseInterval'
                }
                if (componentName === 'BaseDayOfMonth') {
                    return 'BaseDate'
                }
                if (componentName === 'BaseText') {
                    return 'BaseInputText'
                }

                return componentName
            },
            onChange (item) {
                this.model[item.component.ParameterName] = item.value
            }
        },
        mounted () {
            this.model = {
                ReportTriggerTypeID: this.getReportData.ReportTriggerTypeID,
                ReportTriggerName: this.getReportData.ReportTriggerName
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
</style>
<style lang="scss">
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
.trigger-component:not(:last-child) {
    @apply mr-10;
}
.trigger-component .el-input {
    @apply w-32;
}
.time-picker .el-input__inner {
    @apply w-32;
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
</style>
