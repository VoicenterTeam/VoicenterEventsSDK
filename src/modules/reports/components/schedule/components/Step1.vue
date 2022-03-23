<template>
    <div class="content-wrapper leading-5 text-sm font-normal text-gray-950">
        <Conditions :reportItemData="reportItemData" :reportTriggerData="getReportTriggerDataByStep" />
        <portal to="next-button">
            <div class="flex">
                <div
                    @click="onBack"
                    class="text-primary-300 flex items-center hover:text-primary cursor-pointer mx-16"
                >
                    <IconDirLeft/>
                    <span class="mx-1">{{ $t('general.back') }}</span>
                </div>
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
            </div>
        </portal>
    </div>
</template>
<script>

    export default {
        props: {
            reportItemData: {
                type: Object,
                default: () => ({})
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
                clickedOnNextBtn: false
            }
        },
        computed: {
            reportTriggerTypeList() {
                return this.$store.getters['reportTrigger/getConfData'].ReportTriggerTypeList
            },
            getReportTriggerDataByStep () {
                return this.$store.getters['reportTrigger/getReportTriggerDataByStep']('ReportTriggerCondition')
            },
            getReportTriggerData () {
                return this.$store.getters['reportTrigger/getReportTriggerData']
            }
        },
        methods: {
            goNext() {
                this.clickedOnNextBtn = true
                const isConditionGroupsFieldsNotEmpty = () => {
                    return this.getReportTriggerData.ReportTriggerCondition.map(field => {
                        return field.ReportTriggerConditionFilter.every(el => {
                            if (this.checkIfValueIsEmpty(el.WidgetID)) {
                                return true
                            }
                            const isAdditionalFieldsNotEmpty = this.checkIfValueIsEmpty(el.WidgetTemplateColumnID) &&
                                this.checkIfValueIsEmpty(el.ConditionFilterValue) &&
                                this.checkIfValueIsEmpty(el.ConditionFilterOperatorID) &&
                                this.checkIfValueIsEmpty(el.ConditionFilterColumnTypeID)

                            if (el.WidgetID && isAdditionalFieldsNotEmpty) {
                                return true
                            }
                            if (Object.values(el).every(el => !this.checkIfValueIsEmpty(el))) {
                                return true
                            }
                            return false
                        })
                    })
                }
                if (isConditionGroupsFieldsNotEmpty().some(el => !el)) {
                    return
                }

                const objToEmit = {
                    nextStep: true
                }

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
            },
            onBack () {
                this.$emit('on-back')
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
