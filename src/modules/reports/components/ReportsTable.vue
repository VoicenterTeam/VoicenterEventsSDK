<template>
    <div>
        <DataTable ref="table"
                   :has-search="true"
                   :border="true"
                   :id="tableId"
                   :key="tableId"
                   :loading="loadingData"
                   :table-data="tableData"
                   :searchable-fields="searchableFields"
                   :columns="columns"
                   wrapper-class="w-full overflow-auto relative bg-white shadow-base rounded-t-md"
        >
            <template v-slot:header-actions>
                <div class="cursor-pointer text-primary-300 hover:text-primary"
                     @click="onAdd">
                    <div class="flex items-center">
                        <IconAddReport class="w-4 h-4 mx-1"/>
                        <span class="text-main-sm leading-4">{{ $t('Add New Report') }}</span>
                    </div>
                </div>
            </template>
            <template v-slot:expand-content="{row, index}">
                <expand-content :data="row"/>
            </template>
            <template v-slot:index="{index}">
                {{ index }}
            </template>
            <template v-slot:actions="{row, index}">
                <div class="flex items-center justify-center"
                     :key="`action-${index}`">
                    <el-tooltip :content="$t('Duplicate Report')"
                                placement="top">
                            <span class="cursor-pointer text-primary hover:opacity-75"
                                  @click="onDuplicate(row)">
                                <IconDuplicate class="w-4 h-4"/>
                            </span>
                    </el-tooltip>
                    <el-tooltip :content="$t('Edit Report')"
                                placement="top">
                            <span class="cursor-pointer mx-2 text-green hover:opacity-75"
                                  @click="onEdit(row)">
                                <IconPencil class="w-4 h-4"/>
                            </span>
                    </el-tooltip>
                    <el-tooltip :content="$t('Delete Report')"
                                placement="top">
                            <span class="cursor-pointer text-red hover:opacity-75"
                                  @click="onDelete(row)">
                                <IconDelete class="w-4 h-4"/>
                            </span>
                    </el-tooltip>
                </div>
            </template>
            <template v-slot:status="{row}">
                <el-switch :value="reportStatus(row)"
                           active-color="var(--primary-color)"
                           inactive-color="var(--steel)"
                           @change="onChangeReportStatus($event, row)"/>
            </template>
            <template v-slot:ReportItemList="{row}">
                <template v-if="row.ReportItemList && row.ReportItemList.length">
                    <delimited-list :list="get(row, 'ReportItemList', [])" :limit="4" separator=",">
                        <template v-slot:list-item="{item}">
                            <rec-item :item="item"
                                      :name="get(item, 'ReportItemName', '- -')"/>
                        </template>
                        <template v-slot:other-icon="{data}">
                            <tag content-class="icon-ellipsis">+ {{ data }}</tag>
                        </template>
                        <template v-slot:other-content="{list}">
                            <div class="flex flex-wrap max-w-md">
                                <div v-for="(item, index) in list" :key="index"
                                     class="flex items-center justify-start p-1">
                                    {{ get(item, 'ReportItemName', '- -') }}
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
                    <delimited-list :list="get(row, 'ReportTriggerList', [])" :limit="3" separator=",">
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
        </DataTable>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { makeRandomID } from '@/helpers/util'
    import Tag from '@/modules/reports/components/Tag'
    import RecItem from '@/modules/reports/components/RecItem'
    import DataTable from '@/modules/common/components/DataTable'
    import PageLimit from '@/modules/common/components/PageLimit'
    import Template from '@/views/DashboardCreation/components/Template'
    import ExpandContent from '@/modules/reports/components/ExpandContent'
    import DelimitedList from '@/modules/reports/components/DelimitedList'
    import { reportApi } from '@/modules/reports/services/reportService'
    import { STATUS_VALUES, STATUS_IDS } from '@/modules/reports/enum/report'
    
    export default {
        components: {
            Tag,
            RecItem,
            Template,
            DataTable,
            PageLimit,
            DelimitedList,
            ExpandContent,
        },
        data() {
            let tableId = makeRandomID()
            return {
                tableId,
                searchText: '',
                tableData: [],
                loadingData: false,
                searchableFields: ['ReportName'],
                statusColors: {
                    'active-color': '#13ce66',
                    'inactive-color': '#ff4949',
                },
                columns: [
                    {
                        label: '',
                        prop: 'expand-content',
                        align: 'center',
                        type: 'expand',
                        minWidth: '50',
                        maxWidth: '50',
                        width: '50',
                    },
                    {
                        label: this.$t('report.reportName'),
                        prop: 'ReportName',
                        align: 'center',
                        minWidth: 50,
                        maxWidth: 50,
                        icon: 'IconReportColumn',
                        sortable: true,
                    },
                    {
                        label: this.$t('widget.widgetName'),
                        prop: 'ReportItemList',
                        align: 'center',
                        minWidth: 100,
                        icon: 'IconWidgetColumn',
                        sortable: true,
                    },
                    {
                        label: this.$t('report.schedule'),
                        prop: 'ReportTriggerList',
                        align: 'center',
                        minWidth: 100,
                        icon: 'IconScheduleColumn',
                    },
                    {
                        label: this.$t('Active'),
                        prop: 'status',
                        align: 'center',
                        minWidth: 40,
                        maxWidth: 40,
                        icon: 'IconCondition',
                    },
                    {
                        label: this.$t('general.action'),
                        prop: 'actions',
                        align: 'center',
                        icon: 'IconActionColumn',
                        minWidth: 50,
                        maxWidth: 50,
                    },
                ],
            }
        },
        methods: {
            get,
            onAdd() {
                this.emitter('on-add-report')
            },
            onEdit(report) {
                this.emitter('on-edit-report', report)
            },
            onDuplicate(report) {
                this.emitter('on-duplicate-report', report)
            },
            onDelete(report) {
                this.emitter('on-delete-report', report)
            },
            emitter(action, payload = null) {
                this.$emit(`${action}`, payload)
            },
            async getReports() {
                try {
                    this.loadingData = true
                    this.tableData = await this.$store.dispatch('report/getReports')
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loadingData = false
                    this.$nextTick(() => {
                        this.tableId = makeRandomID()
                    })
                }
            },
            onChangeReportStatus(status, row) {
                const ReportStatusID = STATUS_IDS[status]
                this.$set(row, 'ReportStatusID', ReportStatusID)
                const { ReportID } = row
                const payload = {
                    ReportID,
                    ReportStatusID,
                }
                this.updateReport(payload)
            },
            async updateReport(payload) {
                try {
                    await reportApi.changeStatus(payload)
                    this.$notify({
                        type: 'success',
                        icon: true,
                        title: 'Status Updated',
                        message: 'Status updated successfully.',
                    })
                } catch (e) {
                    console.warn(e)
                }
            },
            reportStatus(row) {
                return STATUS_VALUES[row.ReportStatusID]
            },
        },
        async mounted() {
            await this.getReports()
        },
    }
</script>
