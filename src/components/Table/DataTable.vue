<template>
    <div class="data-table__container h-full">
        <portal :to="`widget-header__${widget.WidgetID}`">
            <div class="flex justify-start">
                <slot name="time-frame"/>
                <slot name="search-input"/>
                <slot name="pagination-rows-per-page"/>
            </div>
            <slot name="additional-data"/>
        </portal>
        <portal :to="`widget-header__${widget.WidgetID}-table-action`">
            <div v-if="showBtnSaveChanges">
                <el-tooltip class="item" v-model="showBtnSaveChanges" effect="dark" :open-delay="50" :content="$t('datatable.resize.columns.btn')" placement="top">
                    <span class="flex items-center px-2 py-1 hover:bg-primary-100 rounded cursor-pointer" @click="showConfirmDialog = true">
                        <i class="vc-icon-table el-icon--filter text-primary" />
                    </span>
                </el-tooltip>
            </div>
        </portal>
        <portal :to="`widget-header__${widget.WidgetID}-action`">
            <div
                class="flex items-center table-row__count"
                v-if="showManageColumns"
                :key="`${widget.WidgetID} - ${activeLanguage}`"
            >
                <el-dropdown size="mini" class="px-1-5 hover:bg-primary-100 rounded" trigger="click">
                    <el-tooltip class="item" effect="dark" :content="$t('datatable.manage.columns')" placement="top">
                        <span>
                            <i class="vc-icon-filter el-icon--filter text-primary" />
                        </span>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <manage-columns
                            :key="`${widget.WidgetID} - ${activeLanguage}`"
                            :available-columns="availableColumns"
                            :visible-columns="visibleColumns"
                            :displayQueueAsRows="displayQueueAsRows"
                            @on-change-visibility="updateColumnsVisibility"
                            @on-reorder-column="reorderColumn"
                        />
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </portal>
        <div class="bg-transparent rounded-lg data-table w-full" :id="tableId">
            <el-table
                :data="rowsData"
                :fit="fitWidth"
                :id="tableId"
                :key="tableId"
                class="rounded-lg h-full bg-transparent ltr-direction"
                ref="table"
                row-key="id"
                v-bind="$attrs"
                v-if="drawTable"
                v-on="listeners"
                :max-height="height"
                @header-dragend="showBtnSaveChanges = true"
            >
                <slot name="">
                    <el-table-column
                        class="truncate"
                        :align="column.align"
                        :class-name="column.className"
                        :column-key="column.prop"
                        :fixed="column.fixed || false"
                        :key="column.prop"
                        :label="makeTableHeaderTranslations(column)"
                        :min-width="column.width || column.minWidth || columnMinWidthData"
                        :sortable="canSortRows"
                        :type="column.type"
                        v-bind="column"
                        v-for="column in renderedColumns"
                    >
                        <template slot="header">
                            <div class="flex flex-1 w-full break-normal">
                                <slot :column="column" name="header_title">
                                    <el-tooltip
                                        :open-delay="300"
                                        placement="top"
                                        :content="makeTableHeaderTranslations(column)"
                                    >
                                        <span class="font-bold flex w-full justify-center uppercase leading-5">
                                            {{ makeTableHeaderTranslations(column) }}
                                        </span>
                                    </el-tooltip>
                                </slot>
                            </div>
                        </template>
                        <template slot-scope="{row, $index}">
                            <slot
                                :index="$index"
                                :name="column.prop || column.type || column.label"
                                :row="row"
                            >
                                <div v-html="formatCell(row, column)" />
                            </slot>
                            <slot
                                :column="column"
                                :index="$index"
                                :row="row"
                                name="realTimeCell">
                            </slot>
                        </template>
                    </el-table-column>
                </slot>
            </el-table>
        </div>
        <portal :to="`widget-actions__${widget.WidgetID}`">
            <div class="flex items-center justify-between widget-footer" v-if="tableData.length">
                <export-data
                    :tableId="tableId"
                    :widget="widget"
                    @on-update-layout="updateLayout"
                    v-bind="$attrs"
                    :columns-to-export="columnsToExport"
                >
                    <template v-slot="{onManageExport}">
                        <manage-columns
                            :show-header-container="!onManageExport"
                            :available-columns="availableColumns"
                            v-if="showManageColumns"
                            :visible-columns="visibleColumns"
                            :displayQueueAsRows="displayQueueAsRows"
                            @on-change-visibility="updateColumnsVisibility"
                            @on-reorder-column="reorderColumn"
                        />
                    </template>
                </export-data>
            </div>
        </portal>
        <portal :to="`widget-footer__${widget.WidgetID}`">
            <div class="flex items-center justify-end widget-footer -mx-1 h-12" v-if="tableData.length && !!this.$slots.pagination">
                <div class="flex">
                    <slot name="pagination"/>
                </div>
            </div>
        </portal>
        <ConfirmDialog
            v-if="showConfirmDialog"
            :visible.sync="showConfirmDialog"
            @on-cancel="onCancel"
            @on-confirm="saveChanges"
        >
            <template v-slot:title>
                <h3 class="text-main-2xl font-semibold text-gray-700">
                    {{ $t('general.saveChanges') }}
                </h3>
            </template>
            <div class="flex justify-center w-full">
                <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p">
                    {{ $t('common.changes.save') }}
                </div>
            </div>
            <template v-slot:footer-actions>
                <slot name="footer-actions">
                    <cancel-button
                        @on-click="onCancel"
                    />
                    <confirm-button
                        @on-click="saveChanges"
                    />
                </slot>
            </template>
        </ConfirmDialog>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import ExportDataDialog from './ExportData'
    import { makeRandomID } from '@/helpers/util'
    import { Dropdown, DropdownMenu, Table, TableColumn, Tooltip, Popover, Button } from 'element-ui'
    import { format } from 'date-fns'
    import { DATE_COLUMNS, DATE_TIME_COLUMNS, DATE_FORMAT, DATE_TIME_FORMAT } from '@/helpers/table'
    import bus from '@/event-bus/EventBus'
    import { WidgetApi } from '@/api/widgetApi'
    import notification from '@/mixins/simpleNotification'
    
    const QUEUE_STATISTICS_TEMPLATE = 45
    
    export default {
        inheritAttrs: false,
        components: {
            ManageColumns: () => import('./ManageColumns'),
            [Table.name]: Table,
            [Tooltip.name]: Tooltip,
            [Dropdown.name]: Dropdown,
            [TableColumn.name]: TableColumn,
            [DropdownMenu.name]: DropdownMenu,
            [ExportDataDialog.name]: ExportDataDialog,
            [Popover.name]: Popover,
            [Button.name]: Button,
            ConfirmDialog: () => import('@/components/Common/ConfirmDialog'),
            CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
            ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
        },
        props: {
            columnsToDisplay: {
              type:Number,
              default: 0,
            },
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
            },
            canSortRows: {
                type: [Boolean, String],
                default: false,
            },
            columnMinWidth: {
                type: Number || String,
                default: 170,
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
                screenWidth: screen.width,
                showManageColumns: true,
                columnMinWidthData: this.columnMinWidth,
                templateHelp: {},
                height: 200,
                columnsProperty: [],
                showBtnSaveChanges: false,
                showConfirmDialog: false
            }
        },
        computed: {
            activeLanguage() {
                return this.$store.state.lang.language
            },
            listeners() {
                return {
                    ...this.$listeners,
                }
            },
            renderedColumns() {
                const columnsProperty = this.columnsProperty
                const findTheSameColumn = (column) => {
                    return columnsProperty.find(el => el.columnKey === column.prop)
                }
                const columns = this.availableColumns
                    .filter(c => this.visibleColumns.includes(c.prop))
                    .map(column => {
                        if (columnsProperty && columnsProperty.length) {
                            column.width = findTheSameColumn(column).width
                        }
                        return column
                    })

                if (!this.columnsToDisplay) {
                    return columns
                }

                this.columnsToDisplay
                    .map(column => {
                        if (columnsProperty && columnsProperty.length) {
                            column.width = findTheSameColumn(column).width
                        }
                        return column
                    })

                return columns.slice(0, this.columnsToDisplay)
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
                if (column.prop.indexOf('%') !== -1 || this.columnsWithPercentage.includes(column.prop)) {
                    row[column.prop] = parseFloat(row[column.prop])
                    return `${row[column.prop]} %`
                }
                
                if (DATE_TIME_COLUMNS.includes(column.prop.toLowerCase())) {
                    if (!row[column.prop]) {
                        return '--'
                    }
                    column['containsDate'] = true
                    return this.formatDateColumn(row, column.prop, DATE_TIME_FORMAT)
                }
                
                if (DATE_COLUMNS.includes(column.prop.toLowerCase())) {
                    if (!row[column.prop]) {
                        return '--'
                    }
                    column['containsDate'] = true
                    return this.formatDateColumn(row, column.prop, DATE_FORMAT)
                }
                if (column.prop === 'Stat type') {
                    return  this.$t(row[column.prop])
                }
                return row[column.prop]
            },
            formatDateColumn(row, column, dateFormat) {
                if (this.widget.TemplateID.toString() === QUEUE_STATISTICS_TEMPLATE.toString()) {
                    return row[column].replace(/\//g, '-')
                }
                
                try {
                    // To prevent date-fns errors like: Invalid time value
                    row[column] = row[column].replace('Z', '')
                    return format(new Date(row[column]), dateFormat)
                } catch (e) {
                    return row[column].replace(/\//g, '-')
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
                    this.columnMinWidthData = 150
                    return
                }
                if (scale == 0.8) {
                    this.columnMinWidthData = 130
                    return
                }
                if (scale == 0.75) {
                    this.columnMinWidthData = 120
                    return
                }
                if (scale == 0.67 || scale < 0.34) {
                    this.columnMinWidthData = 90
                    return
                }
                return (this.screenWidth / pageWidth).toFixed(2) * 170
            },
            clearDataSort() {
                if (this.$refs['table']) {
                    this.$refs['table'].clearSort()
                }
            },
            updateDataTableHeight () {
                this.$nextTick(() => {
                    const widgetElement = document.getElementById(`widgetId-${this.widget.WidgetID}`)
                    if (widgetElement && widgetElement.clientHeight) {
                        this.height = !!this.$slots.pagination ? widgetElement.clientHeight - 48 : widgetElement.clientHeight
                    }
                })
            },
            makeTableHeaderTranslations (column) {
                const columnProp = column.prop
                const translateOfHeaderTitleInitials = `widget.table.header.title.initials.${columnProp}`
                const translateOfHeaderTitleFull = `widget.table.header.title.full.${columnProp}`

                return this.$te(translateOfHeaderTitleInitials) ?
                    this.$t(translateOfHeaderTitleInitials) : this.$te(translateOfHeaderTitleFull) ?
                    this.$t(translateOfHeaderTitleFull) : column.label
            },
            async saveChanges () {
                try {
                    await WidgetApi.update(this.widget)
                    notification.call({
                        type: 'success',
                        message: this.$t('general.notify.copy.success')
                    })
                } catch {}
                this.showBtnSaveChanges = false
                this.showConfirmDialog = false
            },
            onCancel () {
                this.showConfirmDialog = false
                this.showBtnSaveChanges = false
            }
        },
        watch: {
            columns: {
                immediate: true,
                handler(newColumns) {
                    this.availableColumns = cloneDeep(newColumns)
                },
            },
            showColumns: {
                immediate: true,
                handler(columns) {
                    this.visibleColumns = cloneDeep(columns)
                    this.columnsToExport = cloneDeep(columns)
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
                handler(val) {
                    if (val) {
                        this.updateDataTableHeight()
                    }
                },
                immediate: true
            },
            tableData: {
                deep: true,
                handler(val) {
                    if (val) {
                        this.updateDataTableHeight()
                    }
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                const widgetElement = document.getElementById(`widgetId-${this.widget.WidgetID}`)
                if (widgetElement) {
                    widgetElement.setAttribute('data-width', widgetElement.clientWidth)
                }
            })
            bus.$on('widget-resized', (widgetID) => {
                if (this.widget.WidgetID === +widgetID) {
                    const widgetElement = document.getElementById(`widgetId-${this.widget.WidgetID}`)
                    const defaultWidth = Number(widgetElement.getAttribute('data-width'))
                    if (defaultWidth === widgetElement.clientWidth) {
                        this.updateDataTableHeight()
                    }
                }
            })

            if (this.widget.WidgetLayout.columnsProperty) {
                this.columnsProperty = this.widget.WidgetLayout.columnsProperty
            }

            const targetNode = this.$refs.table.$el

            const config = { attributes: true, childList: true, subtree: true };

            const callback = (mutationList) => {
                for(const mutation of mutationList) {
                    if (mutation.type === 'attributes') {
                        if (mutation.attributeName === 'width') {
                            this.widget.WidgetLayout.columnsProperty = this.$refs.table.columns.map(el => {
                                const columnData = {}
                                columnData.columnKey = el.columnKey
                                columnData.width = 'width' in el ? el.width : el.realWidth

                                return columnData
                            })
                        }
                    }
                }
            }

            const observer = new MutationObserver(callback)
            observer.observe(targetNode, config)

            this.observer = observer
        },
        beforeDestroy () {
            if (this.observer) {
                this.observer.disconnect()
            }
        }
    }
</script>
<style lang="scss" scoped>
colgroup {
    display: none !important;
}

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
.data-table ::v-deep .sortable-ghost {
    opacity: 0.3;
    @apply bg-gray-300 rounded text-primary cursor-pointer;
    td:hover {
        @apply bg-gray-100;
        @apply cursor-pointer;
    }
}

.el-table ::v-deep th:hover.el-table__cell>.cell {
    @apply flex;
}

.data-table ::v-deep .el-table td.direction-ltr {
    direction: ltr;
}
.el-icon--filter {
    @apply text-xl;
}
::v-deep .cell div > a {
    @apply text-primary underline;
}
</style>
