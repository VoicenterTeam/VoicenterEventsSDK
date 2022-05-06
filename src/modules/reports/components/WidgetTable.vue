<template>
    <div class="w-full">
        <div 
            class="w-full flex items-center"
            :class="showReorderButton ? 'justify-between' : 'justify-end'"
        >
            <div class="flex items-center" v-if="showReorderButton">
                <div>
                        <el-select
                            class="w-48 mr-4 py-1"
                            size="large"
                            v-model="perPage"
                        >
                            <el-option :key="option" :value="parseInt(option)" :label="`${option} ${$t('per page')}`" v-for="option in pageSizes"/>
                        </el-select>
                    </div>
                <el-input
                    clearable
                    :placeholder="$t('general.search')"
                    size="large"
                    v-model="filter">
                    <i slot="prefix" class="el-input__icon vc-icon-search icon-md text-primary ml-1" />
                </el-input>
            </div>
            <div class="flex items-center">
                <base-button type="primary" size="xs" class="mx-4" link @click="changeWidgetsModal" v-if="showReorderButton">
                    <i class="vc-icon-arrow-up icon-md"/>
                    <i class="vc-icon-arrow-down icon-md"/>
                    {{ $t('report.changeWidgetsOrder') }}
                </base-button>
                <base-button type="primary" size="xs" link @click="addWidgetModal">
                    <i class="vc-icon-add icon-md mx-2"/>
                    {{ $t('widget.addNewWidgets') }}
                </base-button>
            </div>
        </div>
        <div class="reports-table__wrapper mt-4">
            <el-table
                :data="paginatedData"
                :sortable="sortable"
                @sort-change="onSortChange"
                :max-height="380"
                height="380"
                style="width: 100%">

                <template slot="empty">
                    <div v-if="isContentLoading">
                        {{ $t('general.loading') }}
                    </div>
                    <div v-else>
                        {{ $t('general.noData') }}
                    </div>
                </template>

                <el-table-column
                    v-for="column in tableProps"
                    :key="column.prop"
                    :label="column.label"
                    :prop="column.prop"
                    :min-width="column.minWidth"
                    sortable>
                    <template slot="header">
                        <div class="text-primary w-full flex items-center justify-center">
                            <i v-if="column.icon" :class="column.icon" class="icon-md mx-2" />
                            {{ column.label }}
                        </div>
                    </template>
                    <template slot-scope="{row}">
                        <div
                            :class="column.prop === 'index' ? 'text-center' : 'flex flex-row items-center'"
                        >
                            <component
                                v-if="column.prop === 'WidgetTitle' && row.WidgetLayout && row.WidgetLayout.DataTypeID"
                                class="mx-2 text-primary"
                                :is="getTemplateIcon(row.WidgetLayout.DataTypeID)"
                            />
                            <span class="px-2">
                                <slot
                                    :name="[column.prop]"
                                    :row="row"
                                >
                                    {{ row[column.prop] }}
                                </slot>
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="column in dynamicActionColumn"
                    :min-width="column.minWidth"
                    :key="column.prop"
                >
                    <template slot="header">
                        <span class="text-primary w-full flex items-center justify-center">
                            <i v-if="column.icon" :class="column.icon" class="icon-md mx-2" />
                            {{ column.label }}
                        </span>
                    </template>
                    <template slot-scope="{row}">
                        <div class="text-center">
                            <div class="py-4 flex items-center justify-center" v-if="column.prop !== 'action'">
                                <el-checkbox
                                    :disabled="disablingCheckbox(column, row)"
                                    @change="onChange(column, row)"
                                    :checked="row.ReportItemExport.some(el => el.ReportExportTypeID === column.ReportExportTypeID)"
                                
                                />
                            </div>
                            <div v-else>
                                <slot :name="[column.prop]" :row="row"/>
                            </div>
                        </div>
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
        <add-widgets-dialog
            :visible.sync="visible"
            @added-widgets="addedWidgets"
            :do-request="false"
        />
    </div>
</template>

<script>
import { Table, TableColumn, Tooltip, Checkbox, Select, Option } from 'element-ui'
import Fuse from 'fuse.js';

import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";
import ReportsPagination from "@/modules/reports/components/ReportsPagination";
import cloneDeep from "lodash/cloneDeep";
import AddWidgetsDialog from '@/components/Reports/Widgets/AddWidgetsDialog.vue'
import { templateIcons } from '@/enum/widgetDataTypes'

export default {
    name: "reports-table",
    props: {
        showReorderButton: {
            type: Boolean,
            default: false
        }
    },
    components: {
        BaseButton,
        [Table.name]: Table,
        [Tooltip.name]: Tooltip,
        [TableColumn.name]: TableColumn,
        ButtonIcon,
        ReportsPagination,
        AddWidgetsDialog,
        [Checkbox.name]: Checkbox,
        [Select.name]: Select,
        [Option.name]: Option
    },
    data () {
        return {
            filter: '',
            searchData: [],
            currentPage: 1,
            perPage: 5,
            fuseSearch: null,
            defaultSort: { prop: 'index', order: 'ascending' },
            visible: false,
            tableProps: [
                {
                    prop: 'index',
                    label: this.$t('general.l.l.l.l.l.№'),
                    icon: '',
                    minWidth: '30'
                },
                {
                    prop: 'WidgetTitle',
                    label: this.$t('widget.widgetName'),
                    icon: 'vc-icon-code',
                    minWidth: '250'
                }
            ],
            sortable: false,
            showStatusText: false,
            pageSizes: [5, 10, 25, 50, 100, 500],
            customPageSize: 10
        }
    },
    methods: {
        onPageSelect(page) {
            this.currentPage = page
        },
        initFuseSearch() {

            const fuseProps = this.tableProps.map(column => {
                return column.prop === 'ReportItemList' ?
                    column.prop + '.WidgetTitle':
                    column.prop === 'ReportTriggerList' ?
                        column.prop + '.ReportTriggerName':
                        column.prop
            })

            this.fuseSearch = new Fuse(this.tableData, {
                keys: fuseProps,
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
        addWidgetModal (data) {
            this.reportId = data.ReportID
            this.visible = true
        },
        addedWidgets ({ activeWidgetItems }) {
            activeWidgetItems.forEach(async el => {
                el.WidgetTitle = el.Title
                el.WidgetTemplateID = el.TemplateID
                el.ReportItemExport = []
                await this.$store.dispatch('report/pushReportItemList', el)
            })
        },
        getTemplateIcon (templateDataTypeID) {
            return templateIcons[templateDataTypeID]
        },
        disablingCheckbox (column, row) {
            if (!column.WidgetTemplateReportExportTypeMappingList.length) {
                return true
            }
            return column.WidgetTemplateReportExportTypeMappingList.some(el => Number(el.WidgetTemplateID) === Number(row.TemplateID))
        },
        onChange (column, row) {
            if (!row.ReportItemExport.length || !row.ReportItemExport.find(el => Number(el.ReportExportTypeID) === Number(column.ReportExportTypeID))) {
                const data = {
                    ReportExportOrder: 0,
                    ReportExportTypeID: column.ReportExportTypeID,
                    ReportItemExportID: 1,
                    ReportExportTypeName: ''
                }

                this.$store.dispatch('report/pushReportItemExport', {
                    data,
                    index: row.index - 1
                })
                row.ReportItemExport.push(
                    data
                )
            } else {
                const indexColumn = row.ReportItemExport.findIndex(el => el.ReportExportTypeID === column.ReportExportTypeID)
                this.$store.dispatch('report/deleteReportItemExport', {
                    indexColumn,
                    index: row.index - 1
                })
                row.ReportItemExport.splice(indexColumn, 1)
            }
        },
        changeWidgetsModal () {
            // TODO: need to create reorder widgets modal
            console.log('changeWidgetsModal')
        }
    },
    computed: {
        tableData () {
            return this.$store.getters['report/getReportData'].ReportItemList
        },
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
            return false
        },
        confData () {
            return this.$store.getters['reportTrigger/getConfData']
        },
        dynamicActionColumn () {
            const dynamicColumns = this.confData.ReportExportTypeList
                .map(el => {
                    el.prop = String(el.ReportExportTypeName).toLowerCase().replaceAll(' ', '_')
                    el.label = this.$t(el.ReportExportTypeNameContentTag)
                    el.icon = 'vc-icon-html'
                    el.minWidth = '80'

                    return el
                })

            const exportTypeList = [
                    ...dynamicColumns,
                    {
                        prop: 'action',
                        label: this.$t('general.action'),
                        icon: 'vc-icon-recycle-bin',
                        minWidth: '70'
                    }
            ]
            return exportTypeList
        }
    },
    watch: {
        tableData: {
            handler(newV) {
                this.initFuseSearch()
                const newData = newV.map((el, index) => {
                    el.index = index + 1
                    return el
                })
                this.searchData = cloneDeep(newData)

            },
            deep: true,
            immediate: true
        },
        filter(newV) {
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

.el-table th.el-table__cell>.cell {
    @apply flex items-center;
}
::v-deep .el-table th.el-table__cell > .cell {
    @apply flex items-center justify-center;;
}

.el-table ::v-deep .el-table__expanded-cell {
    @apply p-0;
}
::v-deep .el-table .caret-wrapper {
    position: absolute;
    right: 2px;
}
</style>
