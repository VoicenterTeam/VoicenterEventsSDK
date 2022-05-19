<template>
    <div class="w-full">
        <reports-table
            sortable="custom"
            :tableData="tableData"
            :tableProps="tableProps"
            @sort-change="onSortChange"
            @on-create-report="addCreateTab"
            :tableActionProps="tableActionProps">
            <template v-slot:expand-content="{row}">
                <div class="border-l-5 p-4 border-primary">
                    <div class="m-2 text-lg font-medium">{{ $t('widget.scheduleList') }}</div>
                    <div class="grid grid-cols-2 gap-4">
                        <schedule-card
                            v-for="(trigger, index) in row.ReportTriggerList"
                            :data="trigger"
                            showBtnSendNow
                            :key="index">
                        </schedule-card>
                    </div>
                </div>
            </template>
            <template v-slot:ReportID="{row}">
                <div class="flex justify-center">
                    {{ get(row, 'ReportID', '') }}
                </div>
            </template>
            <template v-slot:ReportName="{row}">
                <div class="flex justify-center">
                    {{ get(row, 'ReportName', '') }}
                </div>
            </template>
            <template v-slot:ReportItemList="{row}">
                <template v-if="row.ReportItemList && row.ReportItemList.length">
                    <delimited-list :list="get(row, 'ReportItemList', [])" :limit="5" separator=",">
                        <template v-slot:list-item="{item}">
                            <rec-item
                                :item="item"
                                :name="get(item, 'WidgetTitle', '- -')"/>
                        </template>
                        <template v-slot:other-icon="{data}">
                            <tag content-class="icon-ellipsis">+ {{ data }}</tag>
                        </template>
                        <template v-slot:other-content="{list}">
                            <div class="max-w-lg">
                                <div v-for="(item, index) in list" :key="index"
                                     class="flex-1 items-center justify-start p-1">
                                    <tag>
                                        {{ get(item, 'WidgetTitle', '- -') }}
                                    </tag>
                                </div>
                            </div>
                        </template>
                    </delimited-list>
                </template>
                <template v-else>
                    <span class="quick-add-button">
                            <span class="mx-2">
<!--                                TODO: Implement Add Wizard button and modal-->
                                <schedule-form
                                    buttonLabel="Add Widget"
                                    icon="vc-icon-plus-linear"
                                    :reportId="row.ReportID"
                                    @addedSchedule="reloadData"
                                    :data="row"
                                />
                            </span>
                        </span>
                </template>
            </template>

            <template v-slot:ReportTriggerList="{row}">
                <template v-if="row.ReportTriggerList && row.ReportTriggerList.length">
                    <delimited-list :list="get(row, 'ReportTriggerList', [])" :limit="4" separator=",">
                        <template v-slot:list-item="{item}">
                            <rec-item
                                :item="item"
                                :name="get(item, 'ReportTriggerName', '- -')"/>
                        </template>
                        <template v-slot:other-icon="{data}">
                            <tag content-class="icon-ellipsis">+ {{ data }}</tag>
                        </template>
                        <template v-slot:other-content="{list}">
                            <div class="max-w-xs">
                                <div v-for="(item, index) in list" :key="index"
                                     class="flex-1 items-center justify-start p-1">
                                    <tag>
                                        {{ get(item, 'ReportTriggerName', '- -') }}
                                    </tag>
                                </div>
                            </div>
                        </template>
                    </delimited-list>
                </template>
                <template v-else>
                        <span class="quick-add-button">
                            <span class="mx-2">
                                <schedule-form
                                    :buttonLabel="$t('widget.addSchedule')"
                                    icon="vc-icon-plus-linear"
                                    :reportId="row.ReportID"
                                    @addedSchedule="reloadData"
                                    :data="row"
                                    :title="$t('widget.addSchedule')"
                                />
                            </span>
                        </span>
                </template>
            </template>

            <template v-slot:format="{row}">
                <button-icon icon="vc-icon-confirm-action" :description="$t('report.tooltip.exportAsPDF')" type="default"
                             @click="onExportAsPdf(row)"/>
                <button-icon icon="vc-icon-confirm-action" :description="$t('report.tooltip.exportAsCSV')" type="default"
                             @click="onExportAsCSV(row)"/>
                <button-icon icon="vc-icon-confirm-action" :description="$t('report.tooltip.exportAsHTML')" type="default"
                             @click="onExportAsHtml(row)"/>
            </template>
            <template v-slot:action="{row}">
                <button-icon icon="vc-icon-copy" :description="$t('report.tooltip.copyReport')" @click="onReportCopy(row)"/>
                <button-icon icon="vc-icon-edit-pencil" :description="$t('report.tooltip.editReport')" @click="onReportEdit(row)"/>
                <button-icon icon="vc-icon-recycle-bin" :description="$t('report.tooltip.deleteReport')" type="danger"
                             @click="onReportDelete(row)"/>
            </template>
        </reports-table>
        <delete-dialog
            v-if="showDeleteDialog"
            :visible.sync="showDeleteDialog"
            :config="{descriptionIcon: ''}"
            :description="$t('report.deleteReportConfirmation')"
            @on-close="onCancelDelete"
            @on-cancel="onCancelDelete"
            @on-confirm="deleteReport"/>
        <copy-report-dialog
            v-if="showCopyDialog"
            :visible.sync="showCopyDialog"
            :report-copy-name.sync="reportCopyName"
            :is-duplicate-schedules.sync="isDuplicateSchedules"
            :is-duplicate-widgets.sync="isDuplicateWidgets"
            @on-close="onCancelCopy"
            @on-cancel="onCancelCopy"
            @on-confirm="copyReport"/>
    </div>
</template>

<script>
import {Table, TableColumn, Tooltip, Card} from 'element-ui'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

import CopyReportDialog from "@/modules/reports/components/CopyReportDialog";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

import {reportApi} from "../services/reportService"
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";
import ReportsTable from "@/modules/reports/components/ReportsTable";
import RecItem from "@/modules/reports/components/RecItem";
import DelimitedList from "@/modules/reports/components/DelimitedList";
import Tag from "@/modules/reports/components/Tag"
import ScheduleCard from "@/modules/reports/components/ScheduleCard";
import ScheduleForm from '@/modules/reports/components/schedule/ScheduleForm.vue'

const REPORT_ENABLED_STATUS = 1
const REPORT_DISABLED_STATUS = 2

export default {
    name: "reports-list",
    components: {
        BaseButton,
        [Table.name]: Table,
        [Tooltip.name]: Tooltip,
        [TableColumn.name]: TableColumn,
        [Card.name]: Card,
        ButtonIcon,
        ReportsTable,
        RecItem,
        DelimitedList,
        Tag,
        ScheduleCard,
        DeleteDialog,
        CopyReportDialog,
        ScheduleForm
    },
    props: {},
    data() {
        return {
            tableData: [],
            tableProps: [
                {
                    prop: 'ReportID',
                    label: this.$t('general.l.№'),
                    icon: '',
                    minWidth: '50'
                },
                {
                    prop: 'ReportName',
                    label: this.$t('report.reportName'),
                    icon: 'vc-icon-name',
                    minWidth: '200'
                },
                {
                    prop: 'ReportItemList',
                    label: this.$t('widget.widgetName'),
                    icon: 'vc-icon-code',
                    minWidth: '280'
                },
                {
                    prop: 'ReportTriggerList',
                    label: this.$t('report.schedule'),
                    icon: 'vc-icon-schedule-calendar',
                    minWidth: '320'
                }
            ],
            tableActionProps: [
                {
                    prop: 'format',
                    label: this.$t('report.format'),
                    icon: 'vc-icon-confirm-action',
                    minWidth: '100'
                },
                {
                    prop: 'action',
                    label: this.$t('general.action'),
                    icon: 'vc-icon-settings',
                    minWidth: '100'
                }
            ],
            showDeleteDialog: false,
            reportToDelete: null,
            showCopyDialog: false,
            reportToCopy: null,
            reportCopyName: '',
            isDuplicateWidgets: true,
            isDuplicateSchedules: true,
        }
    },
    methods: {
        get,
        addCreateTab() {
            this.$emit('on-create-report')
        },
        onReportEdit(row) {
            this.$emit('on-edit-row', row)
        },
        onReportCopy(row) {
            this.reportToCopy = row
            if (!this.reportToCopy) return
            this.showCopyDialog = true
        },
        onReportDelete(row) {
            this.reportToDelete = get(row, 'ReportID', null)
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

                const reports = await this.getReportsList()
                this.tableData = reports
            } catch (err) {
                console.error(err)
            } finally {
                await this.$store.dispatch('dashboards/setContentLoading', false)
            }
        },
        async copyReport() {
            try {
                await this.$store.dispatch('dashboards/setContentLoading', true)

                let newReport = cloneDeep(this.reportToCopy)
                if (!this.isDuplicateSchedules && !this.isDuplicateWidgets) {
                    newReport.ReportItemList = []
                    newReport.ReportTriggerList = []
                } else if (!this.isDuplicateSchedules && this.isDuplicateWidgets) {
                    newReport.ReportTriggerList = []
                } else if (this.isDuplicateSchedules && !this.isDuplicateWidgets) {
                    let triggerWidgetIds = []
                    newReport.ReportTriggerList.forEach(trigger => {
                        trigger.ReportTriggerCondition.forEach(condition => {
                            condition.ReportTriggerConditionFilter.forEach(filter => {
                                triggerWidgetIds.push(filter.WidgetID)
                            })
                        })
                    })

                    const reportWidgets = newReport.ReportItemList.filter(el => {
                        return triggerWidgetIds.includes(el.WidgetID)
                    })

                    newReport.ReportItemList = reportWidgets
                }

                delete newReport.ReportID
                delete newReport.ReportLayout

                newReport.ReportItemList.forEach(el => {
                    delete el.ReportID
                    delete el.ReportItemID

                    el.ReportItemExport.forEach(item => {
                        delete item.ReportItemExportID
                    })
                })

                newReport.ReportTriggerList.forEach(el => {
                    delete el.ReportID
                    delete el.ReportTriggerID

                    el.ReportTriggerCondition.forEach(trigger => {
                        delete trigger.ReportTriggerID
                        delete trigger.ReportTriggerConditionID
                        trigger.ReportTriggerConditionFilter.forEach(trigger => {
                            delete trigger.ReportTriggerConditionID
                            delete trigger.ReportTriggerConditionFilterID
                        })
                    })

                    el.ReportRecipient.forEach(rec => {
                        delete rec.RecipientID
                        delete rec.ReportID
                        delete rec.ReportRecipientID
                        delete rec.ReportTriggerID
                    })
                })

                if (this.reportCopyName) {
                    newReport.ReportName = this.reportCopyName
                } else {
                    newReport.ReportName += '-copy'
                }

                await reportApi.store(newReport)
                this.reportToCopy = null
                this.showCopyDialog = false

                const reports = await this.getReportsList()
                this.tableData = reports
            } catch (err) {
                console.error(err)
            } finally {
                await this.$store.dispatch('dashboards/setContentLoading', false)
            }
        },
        onCancelDelete() {
            this.reportToDelete = null
            this.showDeleteDialog = false
        },
        onCancelCopy() {
            this.reportToCopy = null
            this.showCopyDialog = false
        },
        onExportAsPdf(row) {
            alert('Export as PDF')
        },
        onExportAsCSV(row) {
            alert('Export as CSV')
        },
        onExportAsHtml(row) {
            alert('Export as HTML')
        },
        async getReportsList() {
            const payload = {
                ReportStatusID: [REPORT_ENABLED_STATUS]
            }
            const reportsList = await reportApi.list(payload)
            return reportsList
        },
        getReportWidgetsList(widgets) {
            return widgets.map(widget => widget.WidgetTitle).join()
        },
        onSortChange({column, prop, order}) {
            if (prop === null) {
                return
            }

            if (order === 'ascending') {
                this.tableData.sort((a, b) => (a[prop] > b[prop]) ? 1 : -1)
            } else if (order === 'descending') {
                this.tableData.sort((a, b) => (a[prop] < b[prop]) ? 1 : -1)
            }
        },
        async loadData () {
            this.tableData = []
            try {
                await this.$store.dispatch('dashboards/setContentLoading', true)
                const reports = await this.getReportsList()

                return reports
            } catch (e) {
                console.error(e)
            } finally {
                await this.$store.dispatch('dashboards/setContentLoading', false)
            }
        },
        async reloadData () {
            this.tableData = await this.loadData()
        }
    },
    async mounted() {
        this.tableData = await this.loadData()
    }
}
</script>

<style scoped lang="scss">
.quick-add-button {
    @apply inline-flex align-middle text-primary;
    padding: 0.2rem 0.4rem;
    border-radius: 1.25rem;
    border: 1px dashed var(--primary-color);
}
</style>
