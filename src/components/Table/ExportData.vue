<template>
    <div class="flex">
        <div @click="triggerExportDialog(exportTo.XLSX)" class="mx-2 cursor-pointer export-button">
            <div class="flex items-center">
                <p class="text-md">{{$t('general.export.excel')}}</p>
                <DownloadIcon class="w-5 mx-1 mb-1 text-primary"/>
            </div>
        </div>
        <div @click="triggerExportDialog(exportTo.CSV)" class="mx-2 cursor-pointer export-button">
            <div class="flex items-center">
                <p class="text-md">{{$t('general.export.csv')}}</p>
                <DownloadIcon class="w-5 mx-1 mb-1 text-primary"/>
            </div>
        </div>
        <modal :visible.sync="showExportDialog" v-if="showExportDialog">
            <div class="flex flex-row items-center pb-4">
                <h3 class="text-main-2xl font-semibold text-gray-700" slot="title">{{$t('Export Data')}}</h3>
                <static-widget-info :widget="widget" class="px-2"/>
            </div>
            <div class="pb-4">
                <label>{{$t('File Name')}}</label>
                <el-input v-model="fileName"/>
            </div>
            <el-alert
                :title="$t('Export Data To') +' '+format"
                type="info"
                :description="$t('Manage or set the order for the columns that will be present in the exported file')"
                :closable="false"
                show-icon
            />
            <div class="py-6 border-b">
                <el-radio v-model="exportFormat" :label="exportTo.CSV">{{$t('CSV')}}</el-radio>
                <el-radio v-model="exportFormat" :label="exportTo.XLSX">{{$t('Excel')}}</el-radio>
            </div>
            <slot :onManageExport="onManageExport"/>
            <template v-slot:footer>
                <el-button @click="showExportDialog = false">{{$t('common.cancel')}}</el-button>
                <el-button @click="exportTableData"
                           :disabled="loading || !columnsToExport.length"
                           :loading="loading"
                           type="primary">{{$t('Export')}}
                </el-button>
            </template>
        </modal>
    </div>
</template>
<script>
    import XLSX from 'xlsx'
    import {Alert, Radio} from 'element-ui'
    import ManageColumns from './ManageColumns'
    import Modal from '@/components/Common/Modal'
    import DownloadIcon from 'vue-feather-icons/icons/DownloadIcon'
    import {isARealtimeTableWidget, timeFilterToHuman} from '@/helpers/widgetUtils'
    import StaticWidgetInfo from '@/components/Widgets/WidgetUpdateForm/StaticWidgetInfo'
    import { DATE_COLUMNS, DATE_TIME_COLUMNS, DATE_FORMAT, DATE_TIME_FORMAT } from '@/helpers/table'
    import { format } from "date-fns"
    
    export default {
        inheritAttrs: false,
        name: 'export-data',
        components: {
            [Alert.name]: Alert,
            [Radio.name]: Radio,
            StaticWidgetInfo,
            ManageColumns,
            DownloadIcon,
            Modal,
        },
        props: {
            tableId: {
                type: String,
                default: '',
            },
            widgetTitle: {
                type: String,
                default: '- -',
            },
            allRecords: {
                type: Array,
                default: () => [],
            },
            widget: {
                type: Object,
                default: () => ({}),
            },
            columnsToExport: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                onManageExport: true,
                exportTo: {
                    XLSX: '.xlsx',
                    CSV: '.csv',
                },
                exportToDictionary: {
                    '.xlsx': 'Excel',
                    '.csv': 'CSV',
                },
                exportFormat: '',
                showExportDialog: false,
                loading: false,
                fileName: '--',
            }
        },
        computed: {
            format() {
                return this.$t(this.exportToDictionary[this.exportFormat])
            },
        },
        methods: {
            triggerExportDialog(exportFormat) {
                this.showExportDialog = true
                this.exportFormat = exportFormat
                this.fileName = this.$t(this.widgetTitle)
            },
            getFileName() {
                let fileName = this.fileName || this.$t('widget.title')
                let timeRange = timeFilterToHuman(this.widget, 'dd-MM-yyyy')

                return fileName + ' ' + timeRange + this.exportFormat
            },
            exportTableData() {
                this.loading = true
                let fileName = this.getFileName()

                if (isARealtimeTableWidget(this.widget)) {
                    this.$emit('on-update-layout', true)
                    this.showExportDialog = false

                    const tableId = this.tableId

                    let tableElement = document.getElementById(tableId)
                    let excelWorkBook = XLSX.utils.table_to_book(tableElement)

                    XLSX.writeFile(excelWorkBook, fileName)

                    return
                }

                const columnsToExport = this.columnsToExport
                let records = []

                this.allRecords.forEach((record) => {
                    let data = {}
                    columnsToExport.forEach(key => {
                        data[this.$t(key)] = this.tryFormatCellTypeDate(record, key)
                    })
                    records.push(data)
                })

                let data = XLSX.utils.json_to_sheet(records)
                let excelWorkBook = XLSX.utils.book_new()

                XLSX.utils.book_append_sheet(excelWorkBook, data, 'data')
                XLSX.writeFile(excelWorkBook, fileName)

                this.$emit('on-update-layout', true)
                this.loading = false
                this.showExportDialog = false
            },
            tryFormatCellTypeDate(record, key) {
                if (DATE_FORMAT.includes(key.toLowerCase())) {
                    try {
                        // To prevent date-fns errors like: Invalid time value
                        record[key] = record[key].replace('Z','')
                        return format(new Date(record[key]), DATE_FORMAT)
                    } catch (e) {
                        return record[key].replace(/\//g, '-')
                    }
                }
                if (DATE_TIME_COLUMNS.includes(key.toLowerCase())) {
                    try {
                        // To prevent date-fns errors like: Invalid time value
                        record[key] = record[key].replace('Z','')
                        return format(new Date(record[key]), DATE_TIME_FORMAT)
                    } catch (e) {
                        return record[key].replace(/\//g, '-')
                    }
                }
                return record[key]
            }
        },
    }
</script>
