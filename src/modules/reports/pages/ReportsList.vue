<template>
    <div class="w-full bg-gray-200">
        List page
        <button @click="addCreateTab">Add Report</button>
        <div>
            <h2>Table</h2>
            <table>
                <tr>
                    <th>ReportID</th>
                    <th>ReportName</th>
                    <th>AccountID</th>
                    <th>LayoutID</th>
                    <th>Actions</th>
                </tr>
                <tr v-for="item in tableData">
                    <td>{{ item.ReportID }}</td>
                    <td>{{ item.ReportName }}</td>
                    <td>{{ item.AccountID }}</td>
                    <td>{{ item.LayoutID }}</td>
                    <td>
                        <button @click="onRowEdit(item)">Edit</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { reportApi } from "../services/reportService"

export default {
    name: "reports-list",
    props: {

    },
    data() {
        return {
            tableData: []
        }
    },
    methods: {
        addCreateTab() {
            this.$emit('on-create-report')
        },
        onRowEdit(row) {
            this.$emit('on-edit-row', row)
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
