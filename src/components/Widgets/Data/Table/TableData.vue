<template>
    <div :style="cssVars">
        <div v-if="isMultiQueuesDashboard(data)">
            <queues-table
                :data="data"
                :queuesData="queuesTableData"/>
        </div>
        <div v-if="isRealtimeWidget(data)">
            <RealTimeUserTable
                :columns="columns"
                :data="data"
                :searchableFields="searchableFields"
                :tableData="tableData">
            </RealTimeUserTable>
        </div>
        <div v-if="isSocketsRealTimeTableWidget(data)">
            <SocketsRealTimeTable
                :columns="columns"
                :data="data"
                :searchableFields="searchableFields"
                :tableData="tableData">
            </SocketsRealTimeTable>
        </div>
        <div v-if="isSimpleTable">
            <data-table
                ref="dataTableRef"
                v-bind="$attrs"
                :widget="data"
                :border="border"
                :columns="availableColumns"
                :editable="editable"
                :showColumns="visibleColumns"
                :stripe="stripe"
                :allRecords="tableData"
                :tableData="fetchTableData"
                :widgetTitle="data.Title"
                can-sort-rows="custom"
                :columnsWithPercentage="columnsWithPercentage"
                @sort-change="onSortChange"
                @on-update-layout="onUpdateLayout">
                <template v-slot:Recording="{row}">
                    <audio-player :url="getRecordingUrl(row.Recording)" v-if="row.Recording"/>
                    <div v-else>{{$t('general.NA')}}</div>
                </template>
                <template v-slot:pagination-rows-per-page>
                    <div class="flex items-center">
                        <el-select
                            @change="handlePageChange(1)"
                            class="w-48 mx-4 py-1"
                            size="small"
                            v-model="pageSize">
                            <el-option :key="option" :value="parseInt(option)" :label="`${option} ${$t('general.perpage')}`" v-for="option in pageSizes"/>
                            <slot>
                                <div class="w-40 mx-2">
                                    <span class="text-xs flex justify-center pb-2">{{$t('widget.table.customValue')}}</span>
                                    <div class="flex flex-row">
                                        <el-input size="mini" class="mx-1" v-model="customPageSize"></el-input>
                                        <el-button size="mini" class="mx-1" @click="applyCustomPageSize">
                                            {{$t('general.apply')}}
                                        </el-button>
                                    </div>
                                </div>
                            </slot>
                        </el-select>
                    </div>
                </template>
                <template v-slot:pagination>
                    <div class="flex items-center">
                        <Pagination class="z-10 rounded-b-md"
                                    v-model="currentPage"
                                    :per-page="pageSize"
                                    hidePerPageOption
                                    :total="filteredDataLength"
                        />
                    </div>
                </template>
                <template v-slot:time-frame>
                    <span class="px-4 flex items-center">
                        <time-frame :widget="data"/>
                    </span>
                </template>
                <template v-slot:search-input>
                    <div class="flex items-center w-48 px-2">
                        <el-input
                            clearable
                            :placeholder="$t('general.search')"
                            size="small"
                            v-model="filter">
                            <i slot="prefix" class="el-input__icon vc-icon-search icon-md text-primary ml-1" />
                        </el-input>
                    </div>
                </template>
            </data-table>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import startCase from 'lodash/startCase'
    import { Option, Select } from 'element-ui'
    import { isMultiQueuesDashboard, isRealtimeWidget, isSocketsRealTimeTableWidget } from '@/helpers/widgetUtils'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import { getWidgetData } from '@/services/widgetService'
    import MultiQueuesDashboard from '@/components/Widgets/Data/Queue/MultiQueuesDashboard'
    import dataTableMixin from '@/mixins/dataTableMixin'
    import { dynamicColumns } from '@/enum/realTimeTableConfigs'
    import { defaultDialerTableColumns } from '@/enum/dialerRealTimeTableConfigs'
    import { defaultFontSize } from '@/enum/defaultDashboardSettings'
    import isEqual from 'lodash/isEqual'

    export default {
        mixins: [dataTableMixin],
        components: {
            DataTable: () => import('@/components/Table/DataTable'),
            TimeFrame: () => import('./TimeFrame'),
            AudioPlayer: () => import('@/components/Audio/AudioPlayer'),
            RealTimeUserTable: () => import('./RealTimeUserTable'),
            Pagination: () => import('@/modules/common/components/Pagination'),
            [Select.name]: Select,
            [Option.name]: Option,
            [MultiQueuesDashboard.name]: MultiQueuesDashboard,
            SocketsRealTimeTable: () => import('./SocketsRealTimeTable')
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                tableData: [],
                columns: [],
                searchableFields: [],
                pageSizes: [5, 10, 25, 50, 100, 500],
                pageSize: 10,
                customPageSize: 10,
                pagerCount: 5,
                currentPage: 1,
                fetchDataInterval: null,
                filter: '',
                filteredDataLength: null,
                hideOnSinglePage: true,
                border: true,
                widget: cloneDeep(this.data),
                stripe: false,
                queuesTableData: [],
                columnsWithPercentage: [],
                fetchTableData: []
            }
        },
        computed: {
            isSimpleTable() {
                return !this.isMultiQueuesDashboard(this.data) && !this.isRealtimeWidget(this.data) && !this.isSocketsRealTimeTableWidget(this.data)
            },
            columnsAreManaged() {
                return !!get(this.data.WidgetLayout, 'Columns.visibleColumns')
            },
            getTypeOfLayout () {
                return this.$store.getters['layout/getTypeOfLayout']
            },
            dynamicFontSize () {
                return get(this.$store.getters['layout/widgetTableContentFontSize'](this.getTypeOfLayout), 'fontSize', defaultFontSize)
            },
            cssVars () {
                const replacePxInString = (string) => {
                    return string.replace('px', '')
                }
                const defaultFontSizeNumber = replacePxInString(defaultFontSize)
                const dynamicFontSizeNumber = replacePxInString(this.dynamicFontSize)
                const fontSize = dynamicFontSizeNumber >= defaultFontSizeNumber ? dynamicFontSizeNumber : defaultFontSizeNumber

                return {
                    '--dynamic-font-size': fontSize + 'px'
                }
            }
        },
        methods: {
            isMultiQueuesDashboard,
            isRealtimeWidget,
            isSocketsRealTimeTableWidget,
            async getWidgetData() {
                try {
                    let data = await getWidgetData(this.widget)

                    if (this.isSocketsRealTimeTableWidget(this.widget)) {
                        this.tableData = defaultDialerTableColumns
                        this.columns = defaultDialerTableColumns
                        this.searchableFields = defaultDialerTableColumns.map(el => el.prop)
                    }

                    if (!data) {
                        return
                    }

                    if (isMultiQueuesDashboard(this.widget)) {
                        this.queuesTableData = data
                        return
                    }

                    let columns = []
                    let containsDate = false
                    let percentageColumns = []

                    if (data.length) {
                        const firstRecord = data[0]
                        for (let column in firstRecord) {

                            const columnData = {
                                prop: column,
                                fixed: false,
                                align: 'center',
                                label: this.$t(column) || startCase(column),
                                className: containsDate ? 'direction-ltr' : '',
                            }

                            columns.push(columnData)

                            if (column === 'Recording') {
                                columnData.minWidth = '320px'
                            }

                            this.searchableFields.push(column)
                        }

                        if (isRealtimeWidget(this.data) && !this.columnsAreManaged) {
                            columns.splice(3, 0, dynamicColumns[0], dynamicColumns[1], dynamicColumns[2], dynamicColumns[3], dynamicColumns[4], dynamicColumns[5], dynamicColumns[6], dynamicColumns[7], dynamicColumns[8])
                        }
                    }

                    this.tableData = data
                    this.columns = columns
                    this.columnsWithPercentage = percentageColumns
                } catch (e) {
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                }
            },
            getRecordingUrl(recordingLink) {
                const div = document.createElement('div')
                div.innerHTML = recordingLink
                const anchor = div.querySelector('a')
                if (anchor && anchor.href) {
                    return anchor.href
                }
                return ''
            },
            storePaginationSettings(pageSize) {
                this.data.WidgetLayout['paginationSize'] = Number(pageSize)
                this.$emit('on-update', this.data)
                this.applyPaginationSettings()
                this.fetchTableData = this.updatePaginatedData(this.tableData)
            },
            applyPaginationSettings() {
                this.pageSize = get(this.data.WidgetLayout, 'paginationSize', 10)
                this.customPageSize = this.pageSize
                if (this.$refs['dataTableRef']) {
                    this.$refs['dataTableRef'].clearDataSort()
                }
            },
            applyCustomPageSize() {
                const pageSize = this.customPageSize
                this.storePaginationSettings(pageSize)
            },
            updatePaginatedData(data) {
                let tableData = data

                if (this.filter) {
                    tableData = tableData.filter(c => {
                        return this.searchableFields.some(field => {
                            if (c[field]) {
                                return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                            }
                            return false
                        })
                    })
                }
                this.filteredDataLength = tableData.length
                return tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            },
            onSortChange({column, prop, order}) {
                if (prop === null) {
                    return
                }

                let sortedData;
                if (order === 'ascending') {
                    sortedData = this.tableData.sort((a, b) => (a[prop] > b[prop]) ? 1 : -1)
                } else if (order === 'descending') {
                    sortedData = this.tableData.sort((a, b) => (a[prop] < b[prop]) ? 1 : -1)
                }

                if (!sortedData) {
                    return
                }

                this.fetchTableData = this.updatePaginatedData(sortedData)
            },
            getWidgetDataWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.getWidgetData()
                        this.applyPaginationSettings()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        watch: {
            filter() {
                if (this.currentPage === 1) {
                    this.fetchTableData = this.updatePaginatedData(this.tableData)
                }

                this.currentPage = 1
            },
            data: {
                immediate: true,
                deep: true,
                handler (oldVal, newVal) {
                    if (!newVal || !isEqual(oldVal, newVal)) {
                        this.getWidgetData()
                        this.getWidgetDataWithRefreshInterval()
                    }
                },
            },
            pageSize: {
                handler: function (val) {
                    this.storePaginationSettings(val)
                },
            },
            currentPage: {
                immediate: true,
                handler() {
                    this.fetchTableData = this.updatePaginatedData(this.tableData)
                }
            },
            tableData: {
                deep: true,
                handler(newV) {
                    this.fetchTableData = this.updatePaginatedData(newV)
                }
            }
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner::placeholder {
    @apply text-gray-500 font-medium text-base pl-1;
}
::v-deep .el-input__inner {
    @apply text-black font-medium text-base;
}
::v-deep .el-table .el-table__cell {
    padding: 6px 0px;
}
::v-deep .el-table thead th .cell {
    line-height: 15px;
    color: #6e6d6d;
    @apply flex;
}
::v-deep .el-table td > .cell {
    @apply text-black font-medium text-sm;
    font-size: var(--dynamic-font-size);
    line-height: 1.1;
}
</style>
