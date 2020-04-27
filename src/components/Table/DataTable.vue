<template>
    <div class="data-table__container">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div class="flex items-center">
                <slot name="title"/>
                <div class="flex w-48 sm:w-64 px-1">
                    <slot name="search-input"/>
                </div>
            </div>
            <slot name="time-frame"/>
            <div :class="margins"
                 class="flex items-center table-row__count">
                <el-dropdown size="mini" trigger="click" v-if="manageColumns">
                    <el-button size="small" type="primary">
                        {{$t('datatable.manage.columns')}}
                        <i class="el-icon-arrow-down el-icon--right"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <manage-columns
                            :available-columns="availableColumns"
                            :visible-columns="visibleColumns"
                            @on-change-visibility="updateColumnsVisibility"
                            @on-reorder-column="reorderColumn">
                        </manage-columns>
                    </el-dropdown-menu>
                </el-dropdown>
                <slot name="additional-data"/>
            </div>
        </div>
        <slot name="container-above"/>
        <div class="bg-white rounded-lg mt-1 data-table w-full">
            <el-table :data="rowsData"
                      :fit="fitWidth"
                      :key="tableKey"
                      :style="customStyle"
                      class="rounded-lg"
                      id="table"
                      ref="table"
                      row-key="id"
                      v-bind="$attrs"
                      v-if="drawTable"
                      v-on="listeners">
                <slot name="">
                    <el-table-column
                        :align="column.align"
                        :class-name="column.className"
                        :column-key="column.prop"
                        :fixed="column.fixed || false"
                        :key="column.prop"
                        :label="$t(column.prop) || column.label"
                        :min-width="column.minWidth || '170px'"
                        :sortable="true"
                        :type="column.type"
                        v-bind="column"
                        v-for="(column, index) in renderedColumns">
                        <template slot="header">
                            <div class="truncate">
                                <slot :column="column" name="header_title">
                                    <el-tooltip :content="$t(column.prop) || column.label" :open-delay="300"
                                                placement="top">
                                    <span class="font-medium uppercase">
                                        {{$t(column.prop) || column.label}}
                                    </span>
                                    </el-tooltip>
                                </slot>
                            </div>
                            <!-- This part is bulky from UI perspective. Has to be refined-->
                            <header-actions
                                :availableColumns="availableColumns"
                                :currentColumn="column"
                                :visibleColumns="visibleColumns"
                                @on-change-columns-size="updateColumnsSize"
                                @on-change-visibility="updateColumnsVisibility"
                                @on-pin-column="(value) => pinColumn(value, index)"
                                @on-reset-props="resetColumnsProps"
                                v-if="false">
                            </header-actions>
                            <!-- This part is bulky from UI perspective. Has to be refined-->
                        </template>
                        <template slot-scope="{row, $index}">
                            <slot :index="$index"
                                  :name="column.prop || column.type || column.label"
                                  :row="row">
                                {{formatCell(row, column)}}
                            </slot>
                            <slot :column="column"
                                  :index="$index"
                                  :row="row"
                                  name="realTimeCell">
                            </slot>
                        </template>
                    </el-table-column>
                </slot>
            </el-table>
        </div>
        <div class="flex items-center justify-between -mx-1" v-if="tableData.length">
            <div class="flex">
                <div @click="exportTableData(EXPORT_TO.XLSX)" class="mx-2 cursor-pointer export-button">
                    <div class="flex items-center">
                        <p class="text-md">{{$t('general.export.excel')}}</p>
                        <DownloadIcon class="w-5 mx-1 mb-1 text-primary"/>
                    </div>
                </div>
                <div @click="exportTableData(EXPORT_TO.CSV)" class="mx-2 cursor-pointer export-button">
                    <div class="flex items-center">
                        <p class="text-md">{{$t('general.export.csv')}}</p>
                        <DownloadIcon class="w-5 mx-1 mb-1 text-primary"/>
                    </div>
                </div>
            </div>
            <div class="flex">
                <slot name="pagination"/>
            </div>
        </div>
    </div>
</template>
<script>

    import XLSX from 'xlsx'
    import get from 'lodash/get'
    import format from 'date-fns/format'
    import Sortable from 'sortablejs'
    import bus from '@/event-bus/EventBus'
    import cloneDeep from 'lodash/cloneDeep'
    import {Dropdown, DropdownMenu, Table, TableColumn, Tooltip} from 'element-ui'
    import ManageColumns from './ManageColumns'
    import HeaderActions from "./Header/HeaderActions"
    import DownloadIcon from 'vue-feather-icons/icons/DownloadIcon'

    const EXPORT_TO = {
        'XLSX': '.xlsx',
        'CSV': '.csv'
    }

    export default {
        inheritAttrs: false,
        components: {
            DownloadIcon,
            ManageColumns,
            HeaderActions,
            [Table.name]: Table,
            [Tooltip.name]: Tooltip,
            [Dropdown.name]: Dropdown,
            [DropdownMenu.name]: DropdownMenu,
            [TableColumn.name]: TableColumn,
        },
        props: {
            tableData: {
                type: Array,
                default: () => ([])
            },
            columns: {
                type: Array,
                default: () => ([])
            },
            showColumns: {
                type: Array,
                default: () => ([])
            },
            editable: {
                type: Boolean,
                default: false
            },
            widgetTitle: {
                type: String,
                default: '- -'
            },
            manageColumns: {
                type: Boolean,
                default: true
            },
            customStyle: {
                type: Object,
                default: () => ({})
            },
        },
        data () {
            return {
                visibleColumns: cloneDeep(this.showColumns),
                availableColumns: cloneDeep(this.columns),
                tableKey: 'table-key',
                active: false,
                fitWidth: true,
                drawTable: true,
                EXPORT_TO
            }
        },
        computed: {
            listeners () {
                return {
                    ...this.$listeners
                }
            },
            renderedColumns () {
                return this.availableColumns.filter(c => this.visibleColumns.includes(c.prop))
            },
            rowsData () {
                return this.tableData
            },
            margins () {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
        },
        methods: {
            formatCell (row, column) {
                // can be used to format cells for all tables
                return row[column.prop]
            },
            tryInitSortable () {
                const table = this.$el.querySelector('.el-table__header-wrapper thead tr')
                const self = this
                Sortable.create(table, {
                    group: 'description',
                    fallbackOnBody: true,
                    animation: 150,
                    onChoose () {
                        bus.$emit('sortable.childDragStart')
                    },
                    onEnd ({newIndex, oldIndex}) {
                        bus.$emit('sortable.childDragStop')
                        const targetRow = get(self.availableColumns.splice(oldIndex, 1), '[0]')
                        self.availableColumns.splice(newIndex, 0, targetRow)
                        self.tableKey = self.availableColumns.map(c => c.prop).join('_')
                        self.updateLayout()
                        self.$nextTick(self.tryInitSortable)
                    }
                })
            },
            updateColumnsVisibility (columns) {
                this.visibleColumns = columns
                this.updateLayout()
            },
            reorderColumn (data) {
                let {element: column, newIndex: newIndex, oldIndex: oldIndex} = data;

                oldIndex = this.availableColumns.findIndex((el) => el.prop === column.prop)

                this.availableColumns.splice(oldIndex, 1);
                this.availableColumns.splice(newIndex, 0, column);

                this.drawTable = false
                this.$nextTick(() => {
                    this.drawTable = true
                })
                this.updateLayout()
            },
            updateLayout () {
                let objToEmit = {
                    visibleColumns: this.visibleColumns,
                    availableColumns: this.availableColumns,
                }
                this.$emit('on-update-layout', objToEmit)
            },
            pinColumn (column, columnIndex) {
                this.availableColumns[columnIndex] = column
            },
            updateColumnsSize (val) {
                this.fitWidth = val
                this.drawTable = false
                this.$nextTick(() => {
                    this.drawTable = true
                })
            },
            resetColumnsProps () {
                this.availableColumns = cloneDeep(this.columns)
                this.visibleColumns = this.columns.map(c => c.prop)
                this.updateLayout()
            },
            getFileName (type) {
                let widgetTitle = this.widgetTitle || this.$t('widget.title')
                let currentDate = format(new Date(), 'MM-dd-yyyy')

                return widgetTitle + ' ' + currentDate + type
            },
            exportTableData (exportTo) {
                let fileName = this.getFileName(exportTo)
                // export Excel file
                let tableElement = document.getElementById('table');
                let excelWorkBook = XLSX.utils.table_to_book(tableElement);
                XLSX.writeFile(excelWorkBook, fileName)
            }
        },
        watch: {
            columns (newColumns) {
                this.visibleColumns = cloneDeep(this.showColumns)
                this.availableColumns = cloneDeep(newColumns)
            }
        },
        mounted () {
            this.tryInitSortable()
        }
    }
</script>
<style lang="scss">

    .el-dropdown-menu--mini {
        padding: 0;

        .popper__arrow {
            display: none !important;
        }
    }

    .export-button :hover {
        color: var(--primary-color);
    }

    th > div.cell > span {
        word-break: initial;
    }

</style>

<style scoped>
    .data-table /deep/ .sortable-ghost {
        opacity: 0.3;
        @apply bg-gray-300 rounded text-primary;
    }

    .data-table /deep/ .el-table td.direction-ltr {
        direction: ltr;
    }
</style>
