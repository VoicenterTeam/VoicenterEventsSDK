<template>
    <div class="relative"
         :class="{'opacity-50': loading}">
        <slot name="table-header">
            <div class="flex items-center mb-4 -mt-2 w-full justify-between">
                <div class="flex items-center">
                    <PageLimit v-model="localPagination.perPage"
                               v-if="perPageFilter"/>
                    <div class="w-52">
                        <el-input v-model="searchText"
                                  clearable
                                  :placeholder="$t('general.search')"
                                  size="medium"
                                  prefix-icon="el-icon-search"
                        />
                    </div>
                </div>
                <slot name="header-actions"/>
            </div>
        </slot>
        <div :class="wrapperClass">
            <el-table
                v-bind="$attrs"
                ref="dataTable"
                :data="filteredData"
                :border="border"
                class="w-full min-w-5xl overflow-x-auto relative"
            >
                <template v-slot:empty>
                    <div v-loading="loading"/>
                    <slot name="empty-text"/>
                </template>
                <el-table-column :column-key="column.prop"
                                 :fixed="column.fixed || false"
                                 :key="column.prop"
                                 :label="$t(column.label) || column.label"
                                 :sortable="column.sortable || false"
                                 :type="column.type"
                                 v-for="(column, index) in columns"
                                 class="truncate border-none"
                                 :min-width="column.minWidth || columnMinWidth"
                                 :max-width="column.maxWidth || 'auto'"
                                 v-bind="column"

                >
                    <template slot="header">
                        <slot :column="column"
                              :index="index"
                              :name="`${column.prop}-header`">
                            <el-tooltip :content="$t(column.label)"
                                        :open-delay="300"
                                        placement="top">
                                <div class="font-medium uppercase flex items-center text-primary truncate">
                                    <i>
                                        <component v-if="column.icon"
                                                   class="w-4 h-4"
                                                   :is="column.icon"/>
                                    </i>
                                    <span class="mx-2 truncate">
                                    {{ $t(column.label) }}
                                </span>
                                </div>
                            </el-tooltip>
                        </slot>
                    </template>
                    <template slot-scope="{row, $index}">
                        <slot :name="column.prop"
                              :row="row"
                              :column="column"
                              :index="$index">
                            <template v-if="column.component">
                                <component :is="column.component"
                                           :column="column"
                                           :params="column.params || {}"
                                           :row="row">
                                </component>
                            </template>
                            <div v-else class="truncate">
                            <span>
                                {{ get(row, column.prop) || '- -' }}
                            </span>
                            </div>
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex w-full">
            <slot name="pagination">
                <Pagination class="z-10 bg-white shadow-light rounded-b-md"
                            v-model="localPagination.currentPage"
                            :per-page="localPagination.perPage"
                            :total="total"
                />
            </slot>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { Table, TableColumn, Tooltip } from 'element-ui'

    export default {
        components: {
            PageLimit: () => import('@/modules/common/components/PageLimit'),
            Pagination: () => import('@/modules/common/components/Pagination'),
            [Table.name]: Table,
            [Tooltip.name]: Tooltip,
            [TableColumn.name]: TableColumn,
        },
        props: {
            perPageFilter: {
                type: Boolean,
                default: true,
            },
            searchableFields: {
                type: Array,
                default: () => [],
            },
            tableData: {
                type: Array,
                default: () => [],
            },
            columns: {
                type: Array,
                default: () => [],
            },
            border: {
                type: Boolean,
                default: true,
            },
            columnMinWidth: {
                type: Number || String,
                default: 170,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            wrapperClass: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                searchText: '',
                localPagination: {
                    perPage: 10,
                    currentPage: 1,
                    perPageOptions: [10, 25, 50],
                    total: 0,
                },
            }
        },
        computed: {
            filteredData() {
                if (!this.tableData) {
                    return []
                }
                const records = this.tableData.filter(c => {
                    return this.searchableFields.some(field => {
                        if (c[field]) {
                            return c[field].toString().toLowerCase().includes(this.searchText.toLowerCase())
                        }
                        return false
                    })
                })
                const from = (this.localPagination.currentPage - 1) * this.localPagination.perPage
                const to = from + this.localPagination.perPage
                return records.slice(from, to)
            },
            total() {
                return this.tableData.length > 0
                    ? this.tableData.length
                    : this.tableData.length
            },
        },
        methods: {
            get,
        },
    }
</script>
<style lang="scss">
.el-table {
    border-radius: 6px;
}

.el-table--border::after, .el-table--group::after, .el-table::before {
    border: none !important;
    background-color: transparent !important;
}

.el-loading-mask .el-loading-spinner {
    display: flex;
    justify-content: center;
}
</style>
