<template>
    <div>
        <data-table
            :widget="data"
            :border="border"
            :cell-class-name="getCellClassName"
            :cell-style="getCellStyle"
            :columns="availableColumns"
            :editable="editable"
            :showColumns="visibleColumns"
            :stripe="stripe"
            :tableData="fetchTableData"
            :widgetTitle="data.Title"
            can-sort-rows="custom"
            @on-update-layout="onUpdateLayout"
            @sort-change="sortChange">
            <template v-slot:search-input>
                <div class="flex items-center w-64 px-1">
                    <el-input
                        clearable
                        :placeholder="$t('general.search')"
                        size="large"
                        v-model="filter">
                        <i slot="prefix" class="el-input__icon vc-icon-search icon-md text-primary ml-1" />
                    </el-input>
                </div>
            </template>
        </data-table>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import dataTableMixin from '@/mixins/dataTableMixin'
    import dialerMixin from '@/mixins/dialerMixin'
    
    export default {
        mixins: [dataTableMixin, dialerMixin],
        components: {
            DataTable: () => import('@/components/Table/DataTable')
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            },
            tableData: {
                type: Array,
                default: () => [],
            },
            columns: {
                type: Array,
                default: () => []
            },
            searchableFields: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                filter: '',
                border: true,
                drawRow: true,
                stripe: true,
                widget: cloneDeep(this.data),
            }
        },
        computed: {
            fetchTableData: {
                get () {
                    let tableData = this.getAllDialersToDisplay
                    const searchableFields = this.searchableFields
                        .filter(el => el !== 'campaignName' && el !== 'campaignType')
                    searchableFields.unshift('name', 'type')

                    if (this.filter && searchableFields.length > 0) {
                        tableData = tableData.filter(c => {
                            return searchableFields.some(field => {
                                if (c[field]) {
                                    return c[field].toString().toLowerCase().includes(this.filter.toLowerCase())
                                }
                                return false
                            })
                        })
                    }

                    tableData = tableData.map((row) => {
                        const additionalDialerStrategyColumns = {}
                        const additionalCallStatisticsColumns = {}
                        if (row.data.DialerStrategy && Object.keys(row.data.DialerStrategy).length) {
                            const dialerStrategy = row.data.DialerStrategy
                            for (const key in dialerStrategy) {
                                additionalDialerStrategyColumns[key] = dialerStrategy[key] || '--'
                            }
                        }
                        if (row.data.CallStatistics && Object.keys(row.data.CallStatistics).length) {
                            const callStatistics = row.data.CallStatistics
                            for (const key in callStatistics) {
                                additionalCallStatisticsColumns[key] = callStatistics[key]
                            }
                        }

                        return {
                            campaignName: row.name,
                            campaignType: row.type,
                            campaignID: row.campaignID,
                            ...additionalDialerStrategyColumns,
                            ...additionalCallStatisticsColumns
                        }
                    })

                    return tableData
                },
                set (newValue) {
                    return newValue
                }
            },
            getAllDialersToDisplay () {
                const campaigns = this.data.WidgetConfig.find(el => el.ParameterName === '{|campaign_ivr_list|}')
                    .WidgetParameterValueJson.EntityPositive
                return this.getAllDialersWithTypeIVR.filter(el => el.data && Object.keys(el.data).length && campaigns.includes(el.campaignID))
            }
        },
        methods: {
            getCellStyle() {
                const color = 'transparent'
                return { 'background-color': color }
            },
            getCellClassName() {
                return ''
            },
            sortChange() {
                this.drawRow = false
                this.$nextTick(() => {
                    this.drawRow = true
                })
            }
        }
    }
</script>
<style lang="scss">
td.text-white > .cell {
    color: white;
}
</style>
