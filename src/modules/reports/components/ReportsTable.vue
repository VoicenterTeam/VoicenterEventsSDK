<template>
    <div class="w-full">
        <div class="w-full flex justify-between">
            <el-input placeholder="Search" class="max-w-52" v-model="reportSearch">
                <i class="vc-icon-search icon-md text-primary el-input__icon"
                   slot="prefix"/>
            </el-input>

            <base-button type="primary" size="xs" link @click="addCreateTab">
                <i class="vc-icon-add icon-md mx-2"/>
                Add New Report
            </base-button>
        </div>
        <div class="reports-table__wrapper mt-4">
            <el-table
                :data="paginatedData"
                :sortable="sortable"
                @sort-change="onSortChange"
                style="width: 100%">

                <template slot="empty">
                    <div v-if="isContentLoading">
                        Loading...
                    </div>
                    <div v-else>
                        No Data
                    </div>
                </template>

                <el-table-column type="expand" min-width="50">
                    <template slot-scope="{row}">
                        <slot name="expand-content" :row="row"></slot>
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="column in tableProps"
                    :key="column.prop"
                    :label="column.label"
                    :prop="column.prop"
                    :min-width="column.minWidth"
                    sortable>
                    <template slot="header">
                        <div class="text-primary">
                            <i v-if="column.icon" :class="column.icon" class="icon-md mx-1"/>
                            {{ column.label }}
                        </div>
                    </template>
                    <template slot-scope="{row}">
                        <slot :name="[column.prop]" :row="row">{{ row[column.prop] }}</slot>
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="column in tableActionProps"
                    :min-width="column.minWidth"
                    :key="column.prop">
                    <template slot="header">
                        <div class="text-primary">
                            <i v-if="column.icon" :class="column.icon" class="icon-md mx-1"/>
                            {{ column.label }}
                        </div>
                    </template>
                    <template slot-scope="{row}">
                        <slot :name="[column.prop]" :row="row"/>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <reports-pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            :paginationFrom="paginationFrom"
            :paginationTo="paginationTo"
            :paginationTotal="paginationTotal"
            @go-to-prev-page="goToPrevPage"
            @go-to-next-page="goToNextPage"
            @on-page-select="onPageSelect"/>
<!--        <div class="pagination_wrapper">
            <div class="flex w-full justify-between">
                <div>
                    Pages:
                    <el-dropdown class="" placement="top-end" trigger="click" @command="onPageSelect">
                        <span class="el-dropdown-link mx-2 align-bottom">
                            {{currentPage}}
                            <i class="vc-icon-down icon-md text-primary"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="item in totalPages"
                                :key="item"
                                :command="item">
                                {{item}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="flex">
                    <span>
                        {{paginationFrom}} - {{paginationTo}}
                    </span>
                    <span class="text-gray-500 mx-1">
                        of
                    </span>
                    <span>
                        {{paginationTotal}}
                    </span>
                    <div class="mx-6">
                        <span @click="goToPrevPage">
                            <i class="vc-icon-left icon-lg text-primary mr-2 cursor-pointer"/>
                        </span>
                        <span @click="goToNextPage">
                            <i class="vc-icon-right icon-lg text-primary ml-2 cursor-pointer"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>-->
    </div>
</template>

<script>
import {Table, TableColumn, Tooltip, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
import Fuse from 'fuse.js';

import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";
import ReportsPagination from "@/modules/reports/components/ReportsPagination";
import cloneDeep from "lodash/cloneDeep";

export default {
    name: "reports-table",
    components: {
        BaseButton,
        [Table.name]: Table,
        [Tooltip.name]: Tooltip,
        [TableColumn.name]: TableColumn,
        ButtonIcon,
        ReportsPagination
        /*[Dropdown.name]: Dropdown,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,*/

    },
    props: {
        tableData: {
            type: Array,
            default: []
        },
        tableProps: {
            type: Array,
            default: []
        },
        tableActionProps: {
            type: Array,
            default: []
        },
        sortable: {
            type: [Boolean, String],
            default: false
        },
    },
    data() {
        return {
            reportSearch: '',
            searchData: [],
            currentPage: 1,
            perPage: 10,
            fuseSearch: null,
            defaultSort: {prop: 'ReportID', order: 'descending'}
            /*totalPages: [
                1,
                2,
                3,
                4
            ]*/
        }
    },
    methods: {
        addCreateTab() {
            this.$emit('on-create-report')
        },
        onPageSelect(page) {
            this.currentPage = page
            console.log(page)
        },
        initFuseSearch() {

            const fuseProps = this.tableProps.map(column => {
                return column.prop === 'ReportItemList'? // || column.prop === 'ReportTriggerList'?
                    column.prop + '.WidgetTitle':
                    column.prop === 'ReportTriggerList'?
                        column.prop + '.ReportTriggerName':
                        column.prop
            })

            this.fuseSearch = new Fuse(this.tableData, {
                keys: fuseProps,//['ReportID', 'ReportName', 'ReportItemList.WidgetTitle', 'ReportTriggerList.ReportTriggerName'],//this.tableProps.map(column => column.prop),
                threshold: 0.3
            });
            if (this.defaultSort) {
                this.$nextTick(() => {
                    this.onSortChange(this.defaultSort)
                })
            }
        },
        onSortChange({column, prop, order}) {
            if (prop === null) {
                return
            }

            if (order === 'ascending') {
                this.searchData.sort((a, b) => (a[prop] > b[prop]) ? 1 : -1)
            } else if (order === 'descending') {
                this.searchData.sort((a, b) => (a[prop] < b[prop]) ? 1 : -1)
            }
        },
        goToPrevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
            }
        },
        goToNextPage() {
            if (this.currentPage < this.totalPages.length) {
                this.currentPage++
            }
        },
    },
    computed: {
        paginatedData() {
            if (this.searchData.length < this.perPage) {
                return this.searchData
            }

            const f = this.perPage * this.currentPage
            return this.searchData.slice(f - this.perPage, f)
        },
        totalPages() {
            const length = this.searchData.length / this.perPage
            const fullLength = this.searchData.length % this.perPage?
                length  + 1:
                length

            let pages = []
            for (let i = 1; i <= fullLength; i++) {
                pages.push(i)
            }
            return pages
        },
        paginationFrom() {
            if (!this.searchData.length) return 0

            return this.currentPage * this.perPage - this.perPage + 1
        },
        paginationTo() {
            if (!this.searchData.length) return 0

            if (this.totalPages.length === this.currentPage) {
                const remainder = this.searchData.length % this.perPage
                if (remainder) {
                    return this.currentPage * this.perPage - this.perPage + remainder
                }
            }
            return this.currentPage * this.perPage
        },
        paginationTotal() {
            return this.searchData.length
        },
        isContentLoading() {
            return this.$store.state.dashboards.contentLoading
        }
    },
    watch: {
        tableData: {
            handler(newV) {
                this.initFuseSearch()
                //this.reportSearch = ''
                // TODO: reset table data
                this.searchData = cloneDeep(newV)

            }
        },
        reportSearch(newV) {
            let result

            this.currentPage = 1
            if (newV !== '') {
                result = this.fuseSearch.search(newV).map(el => el.item);
            } else {
                result = this.tableData
            }

            this.searchData = result;
        }
    },
}
</script>

<style scoped lang="scss">
.reports-table__wrapper ::v-deep .el-table {
    border: 1px solid var(--gray-300);
    @apply rounded-t-1xl border-b-0;

    .el-table__cell:not(:last-child):not(.el-table__expand-column) {
        border-right: 1px solid var(--gray-300);
    }

    .el-table__expand-column {
        .el-table__expand-icon {
            @apply text-primary;
        }
    }
}

/*.pagination_wrapper {
    @apply p-4 rounded-b-1xl;
    border: 1px solid #EBEEF5; //var(--gray-400);
    border-top: 0;
}*/

.el-table ::v-deep th:hover.el-table__cell>.cell {
    @apply flex;
}

.el-table ::v-deep .el-table__expanded-cell {
    @apply p-0;
}

/*.el-table ::v-deep {
    @app
}*/
</style>
