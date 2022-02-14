<template>
    <div class="w-full">
        <div class="w-full flex justify-between">
            <el-input placeholder="Search" class="max-w-52" v-model="reportSearch">
                <i class="vc-icon-search icon-md el-input__icon"
                   slot="prefix"/>
            </el-input>

            <base-button type="primary" link @click="addCreateTab">
                <i class="vc-icon-add icon-md mx-2"/>
                Add New Report
            </base-button>
        </div>
        <div class="mt-4">
            <el-table
                :data="tableData"
                border
                :fit="true"
                :default-sort="{prop: 'ReportID', order: 'descending'}"
                style="width: 100%">
                <el-table-column type="expand" min-width="50">
                    <template slot-scope="{row}">
                        <p>State: {{ row }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="column in tableProps"
                    :label="column.label"
                    :prop="column.prop"
                    :min-width="column.minWidth"
                    sortable>
                    <template slot="header">
                        <div class="text-primary">
                            <i v-if="column.icon" :class="column.icon" class="icon-md mx-1"/>
                            {{ column.label }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="100">
                    <template slot="header">
                        <div class="text-primary">
                            <i class="vc-icon-confirm-action icon-md mx-1"/> Format
                        </div>
                    </template>
                    <template slot-scope="{row}">
                        <button-icon icon="vc-icon-confirm-action" description="Export as PDF" type="default" @click="onExportAsPdf(row)"/>
                        <button-icon icon="vc-icon-confirm-action" description="Export as CSV" type="default" @click="onExportAsCSV(row)"/>
                        <button-icon icon="vc-icon-confirm-action" description="Export as HTML" type="default" @click="onExportAsHtml(row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="100">
                    <template slot="header">
                        <div class="text-primary">
                            <i class="vc-icon-settings icon-md mx-1"/> Action
                        </div>
                    </template>
                    <template slot-scope="{row}">
                        <button-icon icon="vc-icon-copy" description="Copy Report" @click="onReportCopy(row)"/>
                        <button-icon icon="vc-icon-edit-pencil" description="Edit Report" @click="onReportEdit(row)"/>
                        <button-icon icon="vc-icon-recycle-bin" description="Delete Report" type="danger" @click="onReportDelete(row)"/>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import {Dropdown, DropdownMenu, Table, TableColumn, Tooltip} from 'element-ui'

import {reportApi} from "../services/reportService"
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";

export default {
    name: "reports-list",
    components: {
        BaseButton,
        [Table.name]: Table,
        [Tooltip.name]: Tooltip,
        [Dropdown.name]: Dropdown,
        [TableColumn.name]: TableColumn,
        [DropdownMenu.name]: DropdownMenu,
        ButtonIcon
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
                    width: '100',
                    minWidth: '50'
                },
                {
                    prop: 'ReportName',
                    label: 'Report Name',
                    icon: 'vc-icon-name',
                    width: '350',
                    minWidth: '200'
                },
                {
                    prop: 'AccountID',
                    label: 'Widget Name',
                    icon: 'vc-icon-code',
                    width: '400',
                    minWidth: '280'
                },
                {
                    prop: 'LayoutID',
                    label: 'Schedule',
                    icon: 'vc-icon-schedule-calendar',
                    width: '350',
                    minWidth: '320'
                }
            ],
            reportSearch: ''
        }
    },
    methods: {
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
        }
    },
    async mounted() {
        const reports = await this.getReportsList()
        this.tableData = reports.slice(0, 10)
    }
}
</script>
