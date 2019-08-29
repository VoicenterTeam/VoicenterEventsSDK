<template>
    <div class="data-table__container">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between my-4 w-full">
            <div class="flex w-56 sm:w-64">
                <el-input placeholder="Type text to filter" v-model="filter" suffix-icon="el-icon-search"></el-input>
            </div>
            <div class="flex items-center table-row__count mt-4 sm:mt-0"
                 :class="$rtl.isRTL ? 'ml-12' : 'mr-12'">
                <el-dropdown size="mini" trigger="click"
                             :class="$rtl.isRTL ? 'ml-4' : 'mr-4'">
                    <el-button type="primary">
                        {{$t('datatable.manage.columns')}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <manage-columns :available-columns="availableColumns"
                                        :visible-columns="visibleColumns"
                                        @on-change-visibility="updateColumnsVisibility">
                        </manage-columns>
                    </el-dropdown-menu>
                </el-dropdown>
                <p class="text-sm">{{rowsData.length}} / {{data.tableData.length}} row(s)</p>
            </div>
        </div>
        <div class="bg-white rounded-lg my-4 data-table w-full">
            <el-table ref="table"
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
                        <span class="font-medium uppercase" @mouseover="hoverOverHeader(column)"
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
        <div class="flex items-center">
            <download-data class="mx-2"
                    :data="data.tableData"
                    :fields="jsonFields">
                <div class="flex items-center">
                    <p class="text-md">{{$t('general.export.excel')}}</p>
                    <DownloadIcon class="text-blue w-5 mx-1 mb-1"></DownloadIcon>
                </div>
            </download-data>
            <download-data class="mx-2"
                    :data="data.tableData"
                    :fields="jsonFields"
                    type="csv">
                <div class="flex items-center">
                    <p class="text-md">{{$t('general.export.csv')}}</p>
                    <DownloadIcon class="text-blue w-5 mx-1 mb-1"></DownloadIcon>
                </div>
            </download-data>
        </div>
    </div>
</template>

<script>

    import get from 'lodash/get';
    import Sortable from 'sortablejs';
    import bus from '@/event-bus/EventBus'
    import cloneDeep from 'lodash/cloneDeep'
    import {Table, TableColumn} from 'element-ui';
    import HeaderActions from "./Header/HeaderActions";
    import {Dropdown, DropdownMenu} from 'element-ui'
    import ManageColumns from "./ManageColumns";
    import JsonExcel from 'vue-json-excel'
    import DownloadIcon from "vue-feather-icons/icons/DownloadIcon";

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
                drawTable: true,
                filter: ''
            }
        },
        components: {
            DownloadIcon,
            ManageColumns,
            HeaderActions,
            DownloadData: JsonExcel,
            [Table.name]: Table,
            [Dropdown.name]: Dropdown,
            [DropdownMenu.name]: DropdownMenu,
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
            },
            searchableFields: {
                type: Array,
                default: () => ['name', 'job', 'progress']
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
                return this.data.tableData.filter(c => {
                    return this.searchableFields.some(field => {
                        if (c.hasOwnProperty(field)) {
                            return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                        }
                        return false;
                    })
                })
            },
            jsonFields() {
                return this.availableColumns.reduce((obj, item) => {
                    obj[item.label] = item.prop
                    return obj
                }, {});
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

<style  lang="scss">

    .el-dropdown-menu--mini {
        padding: 0;

        .popper__arrow {
            display: none !important;
        }
    }

    .data-table /deep/ .sortable-ghost {
        opacity: 0.3;
        @apply bg-gray-300
        rounded text-primary;
    }

</style>
