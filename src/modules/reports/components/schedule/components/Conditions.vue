<template>
    <div ref="conditions">
        <div class="w-full flex flex-col content-wrapper_step-1" id="content-wrapper_step-1">
            <ConditionGroup
                v-for="(group, index) in reportData"
                class="flex w-full px-1"
                :key="index"
                @on-delete-condition="onDeleteCondition"
                @on-add-condition="onAddCondition(index)"
                @on-delete-group="onDeleteGroup(index)"
                :can-delete="canDelete"
                :conditions="group"
                :reportItemData="reportItemData"
                :index="index"
                :amountOfReportDataLength="reportData.length"
            />
        </div>
        <div class="my-6">
            <base-button
                @click="onNewCriteria"
                type="primary"
                outline
            >
                <span class="font-semibold">
                    {{ $t('report.newCriteria') }}
                </span>
            </base-button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            reportTriggerTypeList: {
                type: Array,
                default: () => []
            },
            conditionFilterColumnTypeList: {
                type: Array,
                default: () => []
            },
            widgetTemplateList: {
                type: Array,
                default: () => []
            },
            reportData: {
                type: Array,
                default: () => []
            },
            reportItemData: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            ConditionGroup: () => import('@/modules/reports/components/schedule/components/ConditionGroup')
        },
        computed: {
            canDelete() {
                return this.reportData.length > 1
            }
        },
        methods: {
            onAddCondition(index) {
                const data = {
                    index,
                    step: 'ReportTriggerCondition'
                }

                this.$store.dispatch('reportTrigger/createNewCondition', data)
            },
            onDeleteCondition(groupIndex, itemIndex) {
                const data = {
                    groupIndex,
                    step: 'ReportTriggerCondition',
                    itemIndex
                }

                this.$store.dispatch('reportTrigger/deleteCondition', data)
            },
            onDeleteGroup(index) {
                const data = {
                    index,
                    step: 'ReportTriggerCondition'
                }
                this.$store.dispatch('reportTrigger/deleteCriteria', data)
            },
            onNewCriteria() {
                this.$store.dispatch('reportTrigger/createNewCriteria', 'ReportTriggerCondition')
                this.$nextTick(() => {
                    const element = document.getElementById('content-wrapper_step-1')
                    element.scrollTo({
                        top: element.scrollHeight,
                        behavior: 'smooth'
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.content-wrapper_step-1 {
    max-height: 150px;
    @apply overflow-auto;
}
</style>
