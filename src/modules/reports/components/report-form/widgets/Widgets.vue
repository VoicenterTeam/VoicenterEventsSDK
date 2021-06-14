<template>
    <div>
        <DataTable :table-data="tableData"
                   :columns="columns"
                   v-if="drawTable"
                   ref="itemsTable"
                   :searchable-fields="searchableFields"
                   wrapper-class="shadow-light rounded-md w-full overflow-auto">
            <template v-slot:header-actions>
                <div class="flex items-center">
                    <ReorderWidgetsDialog @submit="updateItems"
                                          :report="report"/>
                    <ManageWidgetDialog :report="report"
                                        @submit="updateItems"/>
                </div>
            </template>
            <template v-slot:status="{row}">
                <el-switch :value="itemStatus(row)"
                           active-color="var(--primary-color)"
                           inactive-color="var(--steel)"
                           @change="onChangeItemStatus($event, row)"/>
            </template>
            <template v-slot:pdf-header="{column, index}">
                <el-checkbox :value="allToPdf"
                             :disabled="!widgetsExists"
                             :indeterminate="indeterminatePdf"
                             :key="`pdf-header-${index}`"
                             :id="`pdf-header-${index}`"
                             @change="onSelectBulk($event, PDF_EXPORT_TYPE_ID)"/>
                <div class="font-medium uppercase flex items-center text-primary">
                    <i class="mx-2">
                        <component v-if="column.icon"
                                   class="w-4 h-4"
                                   :is="column.icon"
                        />
                    </i>
                    {{ $t(column.label) }}
                </div>
            </template>
            <template v-slot:spreadsheet-header="{column, index}">
                <el-checkbox :value="allToCsv"
                             :disabled="!widgetsExists"
                             :indeterminate="indeterminateCsv"
                             :key="`csv-header-${index}`"
                             :id="`csv-header-${index}`"
                             @change="onSelectBulk($event, CSV_EXPORT_TYPE_ID)"/>
                <div class="font-medium uppercase flex items-center text-primary">
                    <i class="mx-2">
                        <component v-if="column.icon"
                                   class="w-4 h-4"
                                   :is="column.icon"
                        />
                    </i>
                    {{ $t(column.label) }}
                </div>
            </template>
    
            <template v-slot:html-header="{column, index}">
                <el-checkbox :value="allToHtml"
                             :disabled="!widgetsExists"
                             :indeterminate="indeterminateHtml"
                             :key="`csv-header-${index}`"
                             :id="`csv-header-${index}`"
                             @change="onSelectBulk($event, HTML_EXPORT_TYPE_ID)"/>
                <div class="font-medium uppercase flex items-center text-primary">
                    <i class="mx-2">
                        <component v-if="column.icon"
                                   class="w-4 h-4"
                                   :is="column.icon"
                        />
                    </i>
                    {{ $t(column.label) }}
                </div>
            </template>
            
            <template v-slot:index="{row, index}">
                {{ index }}
            </template>
            <template v-slot:pdf="{row, index}">
                <el-checkbox :value="exportToPdf(row)"
                             :key="`to-pdf-${index}`"
                             @change="triggerExportType(row, $event, PDF_EXPORT_TYPE_ID)"/>
            </template>
            <template v-slot:spreadsheet="{row, index}">
                <el-checkbox :value="exportToCsv(row)"
                             :key="`to-csv-${index}`"
                             @change="triggerExportType(row, $event, CSV_EXPORT_TYPE_ID)"/>
            </template>
            <template v-slot:pdf="{row, index}">
                <el-checkbox :value="exportToPdf(row)"
                             :key="`to-html-${index}`"
                             @change="triggerExportType(row, $event, HTML_EXPORT_TYPE_ID)"/>
            </template>
            <template v-slot:actions="{row, index}">
                <div class="flex items-center justify-center"
                     :key="`action-${index}`">
                    <el-tooltip :content="$t('Edit Widget')"
                                placement="top">
                            <span class="cursor-pointer mx-2 text-green hover:opacity-75"
                                  @click="tryEditWidget(row, index)">
                                <IconPencil class="w-4 h-4"/>
                            </span>
                    </el-tooltip>
                    <el-tooltip :content="$t('Delete Report')"
                                placement="top">
                            <span class="cursor-pointer text-red hover:opacity-75"
                                  @click="tryDeleteWidget(index)">
                                <IconDelete class="w-4 h-4"/>
                            </span>
                    </el-tooltip>
                </div>
            </template>
            <template v-slot:empty-text>
                {{ $t('No report items') }}
            </template>
        </DataTable>
        <ConfirmDialog :visible.sync="showDeleteDialog"
                       @on-cancel="onCloseDeleteDialog"
                       @on-confirm="onDeleteWidget"
                       @closed="onCloseDeleteDialog"
        >
            <div class="mt-10 mb-8 flex flex-col items-center justify-center">
                <IconQuestion/>
                <div class="text-center text-gray-900 text-sm leading-21 mt-5 max-w-65-p break-normal">
                    {{ this.$t('Are you sure you want to delete this widget from report?') }}
                </div>
                <b>{{ `#${widgetToDeleteIndex}` }}</b>
            </div>
        </ConfirmDialog>
        <EditReportItem :visible.sync="showEditWidgetDialog"
                        :item="widgetToEdit"
                        :csv-type-i-d="CSV_EXPORT_TYPE_ID"
                        :pdf-type-i-d="PDF_EXPORT_TYPE_ID"
                        :both-type-i-d="BOTH_EXPORT_TYPE_ID"
                        @on-cancel="onCloseEditDialog"
                        @on-confirm="onEditWidget"
                        @closed="onCloseEditDialog"
        />
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Checkbox } from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import PageLimit from '@/modules/common/components/PageLimit'
    import ConfirmDialog from '@/components/Common/ConfirmDialog'
    import DataTable from '@/modules/common/components/DataTable'
    import {
        STATUS_IDS,
        STATUS_VALUES,
        STATUS_NAMES,
        CSV_EXPORT_TYPE_ID,
        PDF_EXPORT_TYPE_ID,
        HTML_EXPORT_TYPE_ID,
        BOTH_EXPORT_TYPE_ID,
    } from '@/modules/reports/enum/report'
    import EditReportItem from '@/modules/reports/components/report-form/widgets/EditReportItem'
    import ManageWidgetDialog from '@/modules/reports/components/report-form/widgets/ManageWidgetDialog'
    import ReorderWidgetsDialog from '@/modules/reports/components/report-form/widgets/ReorderWidgetsDialog'
    
    const PDF = 'pdf'
    const SPREADSHEET = 'spreadsheet'
    
    export default {
        components: {
            PageLimit,
            DataTable,
            ConfirmDialog,
            EditReportItem,
            ManageWidgetDialog,
            ReorderWidgetsDialog,
            [Checkbox.name]: Checkbox,
        },
        props: {
            report: {
                type: Object,
                default: () => ({
                    ReportItemList: [],
                }),
            },
        },
        data() {
            return {
                tableData: [],
                showDeleteDialog: false,
                widgetToDeleteIndex: null,
                showEditWidgetDialog: false,
                widgetToEdit: {},
                searchableFields: ['ReportItemName'],
                PDF,
                SPREADSHEET,
                drawTable: true,
                columns: [
                    {
                        label: this.$t('№'),
                        prop: 'index',
                        align: 'center',
                        minWidth: 20,
                        maxWidth: 20,
                    },
                    {
                        label: this.$t('Widget Name'),
                        prop: 'ReportItemName',
                        align: 'center',
                        sortable: true,
                        minWidth: 100,
                        icon: 'IconWidgetName',
                    },
                    {
                        label: this.$t('Pdf'),
                        prop: 'pdf',
                        align: 'center',
                        minWidth: 40,
                        maxWidth: 40,
                        icon: 'IconPdf',
                    },
                    {
                        label: this.$t('Spreadsheet'),
                        prop: 'spreadsheet',
                        align: 'center',
                        minWidth: 70,
                        maxWidth: 70,
                        icon: 'IconSpreadsheet',
                    },
                    {
                        label: this.$t('Email Body'),
                        prop: 'html',
                        align: 'center',
                        minWidth: 70,
                        maxWidth: 70,
                        icon: 'IconEmailBody',
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
                        label: this.$t('Description'),
                        prop: 'ReportItemDescription',
                        align: 'center',
                        sortable: true,
                        minWidth: 100,
                    },
                    {
                        label: this.$t('Action'),
                        prop: 'actions',
                        icon: 'IconActions',
                        align: 'center',
                        minWidth: 50,
                        maxWidth: 50,
                    },
                ],
                CSV_EXPORT_TYPE_ID,
                PDF_EXPORT_TYPE_ID,
                BOTH_EXPORT_TYPE_ID,
                HTML_EXPORT_TYPE_ID,
            }
        },
        computed: {
            widgetsExists() {
                return this.tableData.length
            },
            allToPdf() {
                if (!this.widgetsExists) {
                    return false
                }
                return this.tableData.every(r => +r.ReportItemExport[0].ReportExportTypeID > 1)
            },
            allToCsv() {
                if (!this.widgetsExists) {
                    return false
                }
                return this.tableData.every(r => [1, 3].includes(+r.ReportItemExport[0].ReportExportTypeID))
            },
            allToHtml() {
                if (!this.widgetsExists) {
                    return false
                }
                return this.tableData.every(r => +r.ReportItemExport[0].ReportExportTypeID > 3)
            },
            indeterminatePdf() {
                if (!this.widgetsExists) {
                    return false
                }
                const selections = this.tableData.some(r => +r.ReportItemExport[0].ReportExportTypeID > 1)
                if (!selections) {
                    return false
                }
                return !this.allToPdf && !selections.length
            },
            indeterminateCsv() {
                if (!this.widgetsExists) {
                    return false
                }
                const countOfSelected = this.tableData.some(r => [1, 3].includes(+r.ReportItemExport[0].ReportExportTypeID))
                if (!countOfSelected) {
                    return false
                }
                return !this.allToCsv && !countOfSelected.length
            },
            indeterminateHtml() {
                if (!this.widgetsExists) {
                    return false
                }
                const selections = this.tableData.some(r => +r.ReportItemExport[0].ReportExportTypeID > 3)
                if (!selections) {
                    return false
                }
                return !this.allToHtml() && !selections.length
            }
        },
        methods: {
            exportToPdf(row) {
                const ReportExportTypeID = get(row, 'ReportItemExport[0].ReportExportTypeID', false)
                if (!ReportExportTypeID) {
                    return
                }
                return [PDF_EXPORT_TYPE_ID, BOTH_EXPORT_TYPE_ID].includes(ReportExportTypeID)
            },
            exportToCsv(row) {
                const ReportExportTypeID = get(row, 'ReportItemExport[0].ReportExportTypeID', false)
                if (!ReportExportTypeID) {
                    return
                }
                return [CSV_EXPORT_TYPE_ID, BOTH_EXPORT_TYPE_ID].includes(ReportExportTypeID)
            },
            itemStatus(row) {
                return STATUS_VALUES[row.ReportItemStatusID]
            },
            onChangeItemStatus(status, row) {
                const ReportItemStatusID = STATUS_IDS[status]
                const ReportItemStatusName = STATUS_NAMES[ReportItemStatusID]
                this.$set(row, 'ReportItemStatusID', ReportItemStatusID)
                this.$set(row, 'ReportItemStatusName', ReportItemStatusName)
            },
            tryDeleteWidget(index) {
                this.showDeleteDialog = true
                this.widgetToDeleteIndex = index
            },
            tryEditWidget(widget, index) {
                this.widgetToEdit = {
                    widget,
                    index,
                }
                this.showEditWidgetDialog = true
            },
            onCloseEditDialog() {
                this.widgetToEdit = null
                this.showEditWidgetDialog = false
                this.fetchReportItems()
            },
            onCloseDeleteDialog() {
                this.showDeleteDialog = false
                this.widgetToDeleteIndex = null
            },
            onDeleteWidget() {
                this.tableData.splice(this.widgetToDeleteIndex, 1)
                this.onCloseDeleteDialog()
            },
            onEditWidget(data) {
                const ReportExportTypeID = get(data, 'ReportItemExport[0].ReportExportTypeID', 3)
                data.ReportItemExport = [{ ReportExportTypeID }]
                this.showEditWidgetDialog = false
            },
            onSelectBulk(state, exportType) {
                this.drawTable = false
                this.tableData = this.tableData.map((row) => {
                    this.triggerExportType(row, state, exportType)
                    return row
                })
                
                this.$nextTick(() => {
                    this.drawTable = true
                })
            },
            triggerExportType(row, state, type) {
                if (state) {
                    if ((+row.ReportItemExport[0]['ReportExportTypeID'] + type) > BOTH_EXPORT_TYPE_ID) {
                        return row
                    }
                    this.drawTable = false
                    row.ReportItemExport[0]['ReportExportTypeID'] = +row.ReportItemExport[0]['ReportExportTypeID'] + type
                } else {
                    this.drawTable = false
                    row.ReportItemExport[0]['ReportExportTypeID'] = +row.ReportItemExport[0]['ReportExportTypeID'] - type
                }
                this.$nextTick(() => {
                    this.drawTable = true
                })
                return row
            },
            updateItems(data) {
                this.tableData = data
                this.$emit('item-upsert', this.tableData)
            },
            fetchReportItems() {
                this.tableData = cloneDeep(this.report.ReportItemList) || []
                this.tableData = this.tableData.map(item => {
                    if (!item.ReportItemExport) {
                        item['ReportItemExport'] = []
                    }
                    return item
                })
            },
        },
        mounted() {
            this.fetchReportItems()
            //console.log('$listeners', this.$listeners)
        },
    }
</script>
