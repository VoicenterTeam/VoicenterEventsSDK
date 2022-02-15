<template>
    <div class="w-full">
        <reports-table
            sortable="custom"
            :tableData="tableData"
            :tableProps="tableProps"
            @sort-change="onSortChange"
            :tableActionProps="tableActionProps">
            <template v-slot:expand="{row}">
                {{ row }}
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
                            <div class="max-w-xs">
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
                    - -
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
                    - -
                </template>
            </template>

            <template v-slot:format="{row}">
                <button-icon icon="vc-icon-confirm-action" description="Export as PDF" type="default"
                             @click="onExportAsPdf(row)"/>
                <button-icon icon="vc-icon-confirm-action" description="Export as CSV" type="default"
                             @click="onExportAsCSV(row)"/>
                <button-icon icon="vc-icon-confirm-action" description="Export as HTML" type="default"
                             @click="onExportAsHtml(row)"/>
            </template>
            <template v-slot:action="{row}">
                <button-icon icon="vc-icon-copy" description="Copy Report" @click="onReportCopy(row)"/>
                <button-icon icon="vc-icon-edit-pencil" description="Edit Report" @click="onReportEdit(row)"/>
                <button-icon icon="vc-icon-recycle-bin" description="Delete Report" type="danger"
                             @click="onReportDelete(row)"/>
            </template>
        </reports-table>
    </div>
</template>

<script>
import {Table, TableColumn, Tooltip} from 'element-ui'
import get from 'lodash/get'

import {reportApi} from "../services/reportService"
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";
import ReportsTable from "@/modules/reports/components/ReportsTable";
import RecItem from "@/modules/reports/components/RecItem";
import DelimitedList from "@/modules/reports/components/DelimitedList";
import Tag from "@/modules/reports/components/Tag"

export default {
    name: "reports-list",
    components: {
        BaseButton,
        [Table.name]: Table,
        [Tooltip.name]: Tooltip,
        [TableColumn.name]: TableColumn,
        ButtonIcon,
        ReportsTable,
        RecItem,
        DelimitedList,
        Tag
    },
    props: {},
    data() {
        return {
            tableData: [],
            tableProps: [
                {
                    prop: 'ReportID',
                    label: '№',
                    icon: '',
                    minWidth: '50'
                },
                {
                    prop: 'ReportName',
                    label: 'Report Name',
                    icon: 'vc-icon-name',
                    minWidth: '200'
                },
                {
                    prop: 'ReportItemList',
                    label: 'Widget Name',
                    icon: 'vc-icon-code',
                    minWidth: '280'
                },
                {
                    prop: 'ReportTriggerList',
                    label: 'Schedule',
                    icon: 'vc-icon-schedule-calendar',
                    minWidth: '320'
                }
            ],
            tableActionProps: [
                {
                    prop: 'format',
                    label: 'Format',
                    icon: 'vc-icon-confirm-action',
                    minWidth: '100'
                },
                {
                    prop: 'action',
                    label: 'Action',
                    icon: 'vc-icon-settings',
                    minWidth: '100'
                }
            ],
            reportSearch: '',
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
            alert('Copy')
        },
        onReportDelete(row) {
            alert('Delete')
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
            const reportsList = await reportApi.list()
            return reportsList
        },
        getReportWidgetsList(widgets) {
            console.log('getReportWidgetsList')
            return widgets.map(widget => widget.WidgetTitle).join()
        },
        isEllipsisActive(e) {
            console.log('e.offsetWidth', e.offsetWidth)
            console.log('e.scrollWidth', e.scrollWidth)
            return (e.offsetWidth < e.scrollWidth);
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
    },
    async mounted() {
        const reports = await this.getReportsList()
        this.tableData = reports//.slice(0, 10)
    },
}
</script>

<style scoped lang="scss">
.aa {
    width: 90%;
    max-width: 90%;
}
</style>
