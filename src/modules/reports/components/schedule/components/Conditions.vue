<template>
    <div ref="conditions">
        <div class="w-full flex flex-col content-wrapper_step-1">
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
                return true
            }
        },
        methods: {
            onAddCondition(index) {
                const data = {
                    index,
                    step: 'ReportTriggerCondition'
                }

                this.$store.dispatch('report/createNewCondition', data)
            },
            onDeleteCondition(groupIndex, itemIndex) {
                const data = {
                    groupIndex,
                    step: 'ReportTriggerCondition',
                    itemIndex
                }

                this.$store.dispatch('report/deleteCondition', data)
            },
            onDeleteGroup(index) {
                const data = {
                    index,
                    step: 'ReportTriggerCondition'
                }
                this.$store.dispatch('report/deleteCriteria', data)
            },
            onNewCriteria() {
                this.$store.dispatch('report/createNewCriteria', 'ReportTriggerCondition')
            }
        }
    }
</script>
<style lang="scss">
.content-wrapper_step-1 {
    max-height: calc(100vh - 500px);
    @apply overflow-auto;
}
</style>
