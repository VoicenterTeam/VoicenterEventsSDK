<template>
    <div>
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
                    <div v-else>{{$t('N/A')}}</div>
                </template>
                <template v-slot:pagination-rows-per-page>
                    <div class="flex items-center">
                        <el-select
                            @change="handlePageChange(1)"
                            class="w-48 mx-4 py-1"
                            size="large"
                            v-model="pageSize">
                            <el-option :key="option" :value="parseInt(option)" :label="`${option} ${$t('per page')}`" v-for="option in pageSizes"/>
                            <slot>
                                <div class="w-40 mx-2">
                                    <span class="text-xs flex justify-center pb-2">{{$t('Custom value')}}</span>
                                    <div class="flex flex-row">
                                        <el-input size="mini" class="mx-1" v-model="customPageSize"></el-input>
                                        <el-button size="mini" class="mx-1" @click="applyCustomPageSize">
                                            {{$t('Apply')}}
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
                    <time-frame :widget="data"/>
                </template>
                <template v-slot:search-input>
                    <div class="flex items-center w-64 px-1 lg:ml-8">
                        <el-input
                            clearable
                            :placeholder="$t('Search')"
                            size="large"
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
    import RealTimeUserTable from './RealTimeUserTable'
    import TimeFrame from './TimeFrame'
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import startCase from 'lodash/startCase'
    import { Option, Select } from 'element-ui'
    import AudioPlayer from '@/components/Audio/AudioPlayer'
    import DataTable from '@/components/Table/DataTable'
    import { isMultiQueuesDashboard, isRealtimeWidget } from '@/helpers/widgetUtils'
    import { getDefaultTimeDelay } from '@/enum/generic'
    import { getWidgetData } from '@/services/widgetService'
    import MultiQueuesDashboard from '@/components/Widgets/Data/Queue/MultiQueuesDashboard'
    import dataTableMixin from '@/mixins/dataTableMixin'
    import { dynamicColumns } from '@/enum/realTimeTableConfigs'
    import Pagination from '@/modules/common/components/Pagination'

    export default {
        mixins: [dataTableMixin],
        components: {
            DataTable,
            TimeFrame,
            AudioPlayer,
            RealTimeUserTable,
            Pagination,
            [Select.name]: Select,
            [Option.name]: Option,
            [MultiQueuesDashboard.name]: MultiQueuesDashboard,
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
                fetchTableData: [],
            }
        },
        computed: {
            getStyles() {
                return this.$store.getters['layout/widgetTitleStyles']
            },
            isSimpleTable() {
                return !this.isMultiQueuesDashboard(this.data) && !this.isRealtimeWidget(this.data)
            },
            columnsAreManaged() {
                return !!get(this.data.WidgetLayout, 'Columns.visibleColumns')
            },
        },
        methods: {
            isMultiQueuesDashboard,
            isRealtimeWidget,
            async getWidgetData() {
                try {
                    let data = await getWidgetData(this.widget)

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

                if (this.filter && this.searchableFields.length > 0) {
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
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }

        },
        watch: {
            filter() {
                this.currentPage = 1
            },
            data: {
                immediate: true,
                deep: true,
                handler: function () {
                    this.getWidgetData()
                    this.applyPaginationSettings()
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
