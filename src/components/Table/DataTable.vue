<template>
    <div class="data-table__container h-full">
        <portal :to="`widget-header__${widget.WidgetID}`">
            <slot name="search-input"/>
            <slot name="time-frame"/>
            <div class="flex items-center table-row__count">
                <el-dropdown class="px-2" size="mini" trigger="click">
                    <el-button size="small" type="primary">
                        {{$t('datatable.manage.columns')}}
                        <i class="el-icon-arrow-down el-icon--right"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" :key="widget.WidgetID">
                        <manage-columns
                            :available-columns="availableColumns"
                            :visible-columns="visibleColumns"
                            :displayQueueAsRows="displayQueueAsRows"
                            @on-change-visibility="updateColumnsVisibility"
                            @on-reorder-column="reorderColumn">
                        </manage-columns>
                    </el-dropdown-menu>
                </el-dropdown>
                <slot name="additional-data"/>
            </div>
        </portal>
        <div class="bg-transparent rounded-lg mt-1 data-table w-full">
            <el-table :data="rowsData"
                      :fit="fitWidth"
                      :id="tableId"
                      :key="tableKey"
                      class="rounded-lg h-full bg-transparent"
                      ref="table"
                      row-key="id"
                      v-bind="$attrs"
                      v-if="drawTable"
                      v-on="listeners">
                <slot name="">
                    <el-table-column
                        class="truncate"
                        :align="column.align"
                        :class-name="column.className"
                        :column-key="column.prop"
                        :fixed="column.fixed || false"
                        :key="column.prop"
                        :label="$t(column.prop) || column.label"
                        :min-width="column.minWidth || columnMinWidth"
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
        <portal :to="`widget-footer__${widget.WidgetID}`">
            <div class="flex items-center justify-between -mx-1 widget-footer" v-if="tableData.length">
                <export-data :tableId="tableId"
                             :widget="widget"
                             @on-update-layout="updateLayout"
                             v-bind="$attrs"
                             :columns-to-export="columnsToExport">
                    <template v-slot="{onManageExport}">
                        <manage-columns
                            :show-header-container="!onManageExport"
                            :available-columns="availableColumns"
                            :visible-columns="visibleColumns"
                            :displayQueueAsRows="displayQueueAsRows"
                            @on-change-visibility="(data) => updateColumnsVisibility(data, onManageExport)"
                            @on-reorder-column="(data) => reorderColumn(data, onManageExport)">
                        </manage-columns>
                    </template>
                </export-data>
                <div class="flex">
                    <slot name="pagination"/>
                </div>
            </div>
        </portal>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    import cloneDeep from 'lodash/cloneDeep'
    import { Dropdown, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui'
    import ManageColumns from './ManageColumns'
    import { makeRandomID } from '@/helpers/util'
    import ExportDataDialog from './ExportData'

    export default {
        inheritAttrs: false,
        components: {
            ManageColumns,
            [Table.name]: Table,
            [Tooltip.name]: Tooltip,
            [Dropdown.name]: Dropdown,
            [TableColumn.name]: TableColumn,
            [DropdownMenu.name]: DropdownMenu,
            [ExportDataDialog.name]: ExportDataDialog,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({}),
            },
            tableData: {
                type: Array,
                default: () => [],
            },
            columns: {
                type: Array,
                default: () => [],
            },
            showColumns: {
                type: Array,
                default: () => [],
            },
            editable: {
                type: Boolean,
                default: false,
            },
            displayQueueAsRows: {
                type: Boolean,
                default: false,
            },
            columnsWithPercentage: {
                type: Array,
                default: () => [],
            }
        },
        data() {
            const tableId = makeRandomID()
            return {
                columnsToExport: cloneDeep(this.showColumns),
                visibleColumns: cloneDeep(this.showColumns),
                availableColumns: cloneDeep(this.columns),
                tableKey: 'table-key',
                active: false,
                fitWidth: true,
                drawTable: true,
                tableId,
                columnMinWidth: '170px',
                screenWidth: screen.width,
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                }
            },
            renderedColumns() {
                return this.availableColumns.filter(c => this.visibleColumns.includes(c.prop))
            },
            rowsData() {
                return this.tableData
            },
            getClass() {
                return 'lg:flex-row lg:items-center lg:justify-between'
            },
            pageWidth() {
                return this.$store.state.utils.page.width
            },
        },
        methods: {
            formatCell(row, column) {
                if (column.isPercentage || column.prop.indexOf('%') !== -1 || this.columnsWithPercentage.includes(column.prop)) {
                    row[column.prop] = parseFloat(row[column.prop])
                    return `${row[column.prop]} %`
                }

                // can be used to format cells for all tables
                return row[column.prop]
            },
            tryInitSortable() {

                const table = this.$el.querySelector('.el-table__header-wrapper thead tr')

                if (!table) {
                    return
                }

                const self = this
                Sortable.create(table, {
                    group: 'description',
                    fallbackOnBody: true,
                    animation: 150,
                    onEnd({ newIndex, oldIndex }) {
                        self.tableKey = self.availableColumns.map(c => c.prop).join('_')
                        self.composePayloadToUpdateLayout(newIndex, oldIndex)
                    },
                })
            },
            composePayloadToUpdateLayout(newIndex, oldIndex) {
                const targetRow = this.renderedColumns[oldIndex]
                const targetRowIndex = this.availableColumns.findIndex(column => column.prop.toString() === targetRow.prop.toString())

                if (targetRowIndex !== -1) {
                    this.availableColumns.splice(targetRowIndex, 1)
                    this.availableColumns.splice(newIndex, 0, targetRow)

                    this.updateLayout()
                }
            },
            updateColumnsVisibility(columns, onManageExport) {
                if (onManageExport) {
                    this.columnsToExport = columns
                    return
                }
                this.visibleColumns = columns
                this.updateLayout()
            },
            reorderColumn(data, onManageExport) {
                let { element: column, newIndex: newIndex, oldIndex: oldIndex } = data

                oldIndex = this.availableColumns.findIndex((el) => el.prop === column.prop)

                this.availableColumns.splice(oldIndex, 1)
                this.availableColumns.splice(newIndex, 0, column)

                if (onManageExport) {
                    oldIndex = this.columnsToExport.findIndex((el) => el.prop === column.prop)

                    this.columnsToExport.splice(oldIndex, 1)
                    this.columnsToExport.splice(newIndex, 0, column.prop)

                    return
                }

                this.updateLayout()
            },
            updateLayout(afterExport = false) {
                let objToEmit = {}

                if (!this.displayQueueAsRows) {
                    objToEmit = {
                        visibleColumns: afterExport ? this.columnsToExport : this.visibleColumns,
                        availableColumns: this.availableColumns,
                    }
                } else {
                    objToEmit = {
                        visibleQueuesColumns: afterExport ? this.columnsToExport : this.visibleColumns,
                        availableQueuesColumns: this.availableColumns,
                    }
                }

                this.drawTable = false
                this.$nextTick(() => {
                    this.drawTable = true
                })

                this.$emit('on-update-layout', objToEmit)
            },
            adaptColumnWidth(scale, pageWidth) {
                if (scale == 0.9) {
                    this.columnMinWidth = 150
                    return
                }
                if (scale == 0.8) {
                    this.columnMinWidth = 130
                    return
                }
                if (scale == 0.75) {
                    this.columnMinWidth = 120
                    return
                }
                if (scale == 0.67 || scale < 0.34) {
                    this.columnMinWidth = 90
                    return
                }
                return (this.screenWidth / pageWidth).toFixed(2) * 170
            },
        },
        watch: {
            columns: {
                immediate: true,
                handler(newColumns) {
                    this.visibleColumns = cloneDeep(this.showColumns)
                    this.availableColumns = cloneDeep(newColumns)
                },
            },
            pageWidth: {
                immediate: true,
                handler(value) {
                    const scale = (this.screenWidth / value).toFixed(2)
                    this.adaptColumnWidth(scale, value)
                },
            },
            widget: {
                deep: true,
                handler() {
                    this.tryInitSortable()
                },
            },
        },
        mounted() {
            this.tryInitSortable()
        },

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
<style scoped lang="scss">
    .data-table /deep/ .sortable-ghost {
        opacity: 0.3;
        @apply bg-gray-300 rounded text-primary;
    }

    .data-table /deep/ .el-table td.direction-ltr {
        direction: ltr;
    }
</style>
