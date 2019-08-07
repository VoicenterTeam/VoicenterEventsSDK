<template>
    <div class="bg-white rounded-lg py-2 my-4 data-table w-full">
        <el-table ref="table"
                  row-key="id"
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
                        :type="column.type">
                    <template slot="header">
                        <span class="flex items-center" @mouseover="hoverOverHeader(column)"
                              @mouseleave="hoverOverHeader(column)">
                            {{column.label}}
                        </span>
                        <header-actions
                                :availableColumns="availableColumns"
                                :visibleColumns="visibleColumns"
                                :currentColumn="column"
                                @on-change-visibility="updateColumnsVisibility"
                                @on-change-columns-size="updateColumnsSize"
                                @on-pin-column="(value) => pinColumn(value, index)"
                                @on-reset-props="resetColumnsProps">
                        </header-actions>
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
</template>

<script>

    import get from 'lodash/get';
    import Sortable from 'sortablejs';
    import cloneDeep from 'lodash/cloneDeep'
    import bus from '@/event-bus/EventBus'
    import {Table, TableColumn} from 'element-ui';
    import HeaderActions from "./Header/HeaderActions";

    export default {
        name: "data-table",
        inheritAttrs: false,
        data() {
            return {
                visibleColumns: this.data.columns.map(c => c.prop),
                availableColumns: cloneDeep(this.data.columns),
                tableKey: 'table-key',
                active: false,
                fitWidth: true,
                drawTable: true
            }
        },
        components: {
            HeaderActions,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
        },
        props: {
            data: {
                type: Object,
                default: () => ({
                    tableData: [],
                    columns: []
                })
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners
                }
            },
            renderedColumns() {
                return this.availableColumns.filter(c => this.visibleColumns.includes(c.prop));
            },
            rowsData() {
                return this.data.tableData
            }
        },
        methods: {
            hoverOverHeader(column) {
                this.$set(column, 'edit', !column.edit)
            },
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
                        const targetRow = get(self.visibleColumns.splice(oldIndex, 1), '[0]')
                        self.visibleColumns.splice(newIndex, 0, targetRow)
                        self.tableKey = self.visibleColumns.map(c => c.prop).join('_')
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
                this.availableColumns = cloneDeep(this.data.columns)
                this.visibleColumns = this.data.columns.map(c => c.prop)
            }
        },
        watch: {
            'data.columns'(value) {
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

    /*.el-table th .header-handle {*/
    /*    display: none;*/
    /*}*/

    /*.el-table th .caret-wrapper {*/
    /*    display: none;*/
    /*}*/

    .el-table th:hover {
        @apply bg-gray-100;
        @apply cursor-pointer;
    }

    /*.el-table th:hover .header-handle {*/
    /*    display: flex;*/
    /*}*/

    /*.el-table th:hover .caret-wrapper {*/
    /*    display: flex;*/
    /*}*/

    .el-table th > .cell {
        @apply flex;
        @apply items-center;
    }

    .rtl .el-select {
        .el-tag__close.el-icon-close {
            left: -5px;
            right: auto;
        }

        .el-tag {
            margin: 2px 6px 2px 0px;
        }
    }

    .rtl .el-table td {
        text-align: right;
    }
</style>

<style>
    .data-table /deep/ .sortable-ghost {
        opacity: 0.3;
        @apply bg-gray-500 rounded text-white;
    }
</style>
