<template>
    <div class="h-full w-full">
        <widget-table :showReorderButton="showReorderButton" :reportId="reportId" ref="widgetTable">
            <template v-slot:action="{row}">
                <span>
                    <i class="vc-icon-recycle-bin cursor-pointer text-xl text-red" @click="onReportDelete(row)"></i>
                </span>
            </template>
        </widget-table>
    </div>
</template>

<script>
import WidgetTable from '@/modules/reports/components/WidgetTable.vue'
import ButtonIcon from "@/modules/common/components/ButtonIcon"
import { Notification } from 'element-ui'

export default {
    components: {
        WidgetTable,
        ButtonIcon
    },
    props: {
        showReorderButton: {
            type: Boolean,
            default: false
        },
        reportId: {
            type: [Number, String],
            default: ''
        }
    },
    computed: {
        getReportData () {
            return this.$store.getters['report/getReportData']
        }
    },
    methods: {   
        async onReportDelete (rowData) {
            const isExist = await this.checkIfWidgetExistInScheduleList(rowData)
            if (isExist) {
                Notification.warning(this.$t('report.deleteWidget.errorMsg'))
                return
            }
            const currentIndex = rowData.index - 1
            await this.$store.dispatch('report/deleteReportItemList', currentIndex)
            this.$refs.widgetTable.reInitCheckboxes()
        },
        validate () {
            return this.getReportData.ReportItemList.length
        },
        async checkIfWidgetExistInScheduleList (rowData) {
            let isWidgetExistInScheduleList = false
            this.getReportData.ReportTriggerList.forEach(el => {
                el.ReportTriggerCondition.forEach(el => {
                    isWidgetExistInScheduleList = el.ReportTriggerConditionFilter.some(el => el.WidgetID === rowData.WidgetID)
                })
            })
            return isWidgetExistInScheduleList
        }
    }
}
</script>
