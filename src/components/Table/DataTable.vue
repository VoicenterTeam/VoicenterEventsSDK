<template>
    <div class="data-table__container">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div class="flex w-48 sm:w-64">
                <slot name="search-input"/>
            </div>
            <div class="flex items-center table-row__count mt-4 sm:mt-0"
                 :class="margins">
                <el-dropdown size="mini" trigger="click"
                             :class="$rtl.isRTL ? 'ml-4' : 'mr-4'">
                    <el-button type="primary">
                        {{$t('datatable.manage.columns')}}
                        <i class="el-icon-arrow-down el-icon--right"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <manage-columns :available-columns="availableColumns"
                                        :visible-columns="visibleColumns"
                                        @on-change-visibility="updateColumnsVisibility">
                        </manage-columns>
                    </el-dropdown-menu>
                </el-dropdown>
                <slot name="additional-data"/>
            </div>
        </div>
        <div class="bg-white rounded-lg my-4 data-table w-full">
            <el-table ref="table"
                      id="table"
                      row-key="id"
                      class="rounded-lg"
                      v-if="drawTable"
                      :fit="fitWidth"
                      :key="tableKey"
                      :data="rowsData"
                      v-bind="$attrs"
                      v-on="listeners">
                <slot name="">
                    <el-table-column
                        v-for="(column, index) in renderedColumns"
                        :key="column.prop"
                        v-bind="column"
                        :column-key="column.prop"
                        :min-width="column.minWidth || '150px'"
                        :fixed="column.fixed || false"
                        :align="column.align"
                        :type="column.type">
                        <template slot="header">
                            <div class="truncate">
                                <el-tooltip :content="column.label" :open-delay="300" placement="top">
                                <span class="font-medium uppercase">
                                    {{column.label}}
                                </span>
                                </el-tooltip>
                            </div>
                            <!-- This part is bulky from UI perspective. Has to be refined-->
                            <header-actions
                                v-if="false"
                                :availableColumns="availableColumns"
                                :visibleColumns="visibleColumns"
                                :currentColumn="column"
                                @on-change-visibility="updateColumnsVisibility"
                                @on-change-columns-size="updateColumnsSize"
                                @on-pin-column="(value) => pinColumn(value, index)"
                                @on-reset-props="resetColumnsProps">
                            </header-actions>
                            <!-- This part is bulky from UI perspective. Has to be refined-->
                        </template>
                        <template slot-scope="{row, $index}">
                            <slot :name="column.prop || column.type || column.label"
                                  :row="row"
                                  :index="$index">
                                {{row[column.prop]}}
                            </slot>
                        </template>
                    </el-table-column>
                </slot>
            </el-table>
        </div>
        <div class="flex items-center justify-between -mx-1" v-if="tableData.length">
            <div class="flex">
                <div class="mx-2 cursor-pointer export-button" @click="exportTableData(EXPORT_TO.XLSX)">
                    <div class="flex items-center">
                        <p class="text-md">{{$t('general.export.excel')}}</p>
                        <DownloadIcon class="w-5 mx-1 mb-1 text-primary"/>
                    </div>
                </div>
                <div class="mx-2 cursor-pointer export-button" @click="exportTableData(EXPORT_TO.CSV)">
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
    import {format} from 'date-fns'
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
            editable: {
                type: Boolean,
                default: false
            },
            widgetTitle: {
                type: String,
                default: '- -'
            }
        },
        data() {
            return {
                visibleColumns: this.columns.map(c => c.prop),
                availableColumns: cloneDeep(this.columns),
                tableKey: 'table-key',
                active: false,
                fitWidth: true,
                drawTable: true,
                EXPORT_TO
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners
                }
            },
            renderedColumns() {
                return this.availableColumns.filter(c => this.visibleColumns.includes(c.prop))
            },
            rowsData() {
                return this.tableData
            },
            margins() {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
        },
        methods: {
            tryInitSortable() {
                const table = this.$el.querySelector('.el-table__header-wrapper thead tr')
                const self = this
                Sortable.create(table, {
                    group: 'description',
                    fallbackOnBody: true,
                    animation: 150,
                    onChoose() {
                        bus.$emit('sortable.childDragStart')
                    },
                    onEnd({newIndex, oldIndex}) {
                        bus.$emit('sortable.childDragStop')
                        const targetRow = get(self.availableColumns.splice(oldIndex, 1), '[0]')
                        self.availableColumns.splice(newIndex, 0, targetRow)
                        self.tableKey = self.availableColumns.map(c => c.prop).join('_')
                        self.$nextTick(self.tryInitSortable)
                    }
                })
            },
            updateColumnsVisibility(columns) {
                this.visibleColumns = columns
            },
            pinColumn(column, columnIndex) {
                this.availableColumns[columnIndex] = column
            },
            updateColumnsSize(val) {
                this.fitWidth = val
                this.drawTable = false
                this.$nextTick(() => {
                    this.drawTable = true
                })
            },
            resetColumnsProps() {
                this.availableColumns = cloneDeep(this.columns)
                this.visibleColumns = this.columns.map(c => c.prop)
            },
            getFileName(type) {
                let widgetTitle = this.widgetTitle || this.$t('widget.title')
                let currentDate = format(new Date(), 'MM-dd-yyyy')

                return widgetTitle + ' ' + currentDate + type
            },
            exportTableData(exportTo) {
                let fileName = this.getFileName(exportTo)
                // export Excel file
                let tableElement = document.getElementById('table');
                let excelWorkBook = XLSX.utils.table_to_book(tableElement);
                XLSX.writeFile(excelWorkBook, fileName)
            }
        },
        watch: {
            'columns'(value) {
                this.visibleColumns = value.map(c => c.prop)
                this.availableColumns = cloneDeep(value)
            }
        },
        mounted() {
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

<style>
    .data-table /deep/ .sortable-ghost {
        opacity: 0.3;
        @apply bg-gray-300 rounded text-primary;
    }
</style>
