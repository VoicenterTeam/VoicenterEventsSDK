<template>
    <div>
        <div class="flex items-center">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="flex flex-wrap -mx-1 pt-2" v-if="queueStatistics">
            <div v-for="item in queueStatistics[PRIMARY_TYPE]">
                <statistic-card
                    v-if="displayCounter(item)"
                    @on-change="(data) => onChange(data, item)"
                    :item="item"
                />
            </div>
            <div v-for="item in queueStatistics[PERCENTAGE_TYPE]">
                <statistic-card
                    v-if="displayCounter(item)"
                    @on-change="(data) => onChange(data, item)"
                    :item="getItem(item)"
                />
            </div>
            <div v-if="showSumOfOthers" class="statistic-card"
                 v-html="getSumOfOtherStatistics()">
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import cloneDeep from 'lodash/cloneDeep'
    import sumBy from 'lodash/sumBy'
    import startCase from 'lodash/startCase'
    import {
        ADDITIONAL_DATA_KEY,
        allStatistics,
        OTHER_STATISTIC_LABEL,
        PERCENTAGE_COUNTERS,
        PERCENTAGE_TYPE,
        PRIMARY_COUNTERS,
        PRIMARY_TYPE,
        statistics,
        TOTAL_CALLS_KEY,
    } from '@/enum/queueDashboardStatistics'
    import StatisticCard from './StatisticCard'
    import {getWidgetData} from '@/services/widgetService'
    import {getDefaultTimeDelay} from "@/enum/generic";

    export default {
        components: {
            StatisticCard,
        },
        props: {
            data: Object,
            default: () => ({})
        },
        data() {
            return {
                fetchDataInterval: null,
                queueStatistics: {},
                ADDITIONAL_DATA_KEY,
                PERCENTAGE_TYPE,
                PRIMARY_TYPE,
                TOTAL_CALLS_KEY,
            }
        },
        computed: {
            countersToShow() {
                return get(this.data.WidgetLayout, 'ShowStatistics')
            },
            showSumOfOthers() {
                return get(this.data.WidgetLayout, 'SumOfOthers')
            },
            showAbsoluteNumbers() {
                return get(this.data.WidgetLayout, 'AbsoluteNumbers')
            },
        },
        methods: {
            startCase,
            getSumOfOtherStatistics() {
                let queueData = this.queueStatistics[PERCENTAGE_TYPE]

                let totalCalls = this.queueStatistics[TOTAL_CALLS_KEY]
                let countersToShow = this.countersToShow
                let hiddenStatistics = []

                Object.keys(queueData).forEach((key) => {
                    if (!countersToShow.includes(key)) {
                        hiddenStatistics.push(queueData[key])

                    }
                })

                let sum = sumBy(hiddenStatistics, 'value')

                let percentage = (sum * 100) / totalCalls
                let percentageText = percentage.toFixed(2)

                if (isNaN(percentage)) {
                    percentageText = '--'
                }

                return `<div class="text-2xl px-2">${OTHER_STATISTIC_LABEL}</div><div class="text-3xl">${percentageText} %</div>`
            },
            getItem(item) {
                let totalCalls = this.queueStatistics[TOTAL_CALLS_KEY] || 1
                let count = item.value || 0
                let percentage = `${((count * 100) / totalCalls).toFixed(2)} %`

                let result = {
                    ...item,
                    value: percentage,
                    showAbsoluteNumbers: this.showAbsoluteNumbers,
                    count
                }

                return result
            },
            async getWidgetData() {
                try {
                    let data = await getWidgetData(this.data)
                    if (data) {
                        this.queueStatistics = cloneDeep(this.data.WidgetLayout.allStatistics)
                        this.composeStatistics(data)
                    }
                } catch (e) {
                    console.warn(e)
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                } finally {
                }
            },
            composeStatistics(data) {
                data.forEach((queue) => {
                    delete queue.queue_id;

                    this.queueStatistics[TOTAL_CALLS_KEY] += queue[TOTAL_CALLS_KEY]
                    Object.keys(queue).forEach((key) => {

                        if (key === ADDITIONAL_DATA_KEY) {
                            this.fetchAdditionalCounts(queue[ADDITIONAL_DATA_KEY])
                        } else {
                            this.queueStatistics[PRIMARY_TYPE][key]['value'] += queue[key]
                        }
                    })
                })
            },
            fetchAdditionalCounts(queueData) {
                queueData.forEach((option) => {
                    this.queueStatistics[PERCENTAGE_TYPE][option['billing_cdr_queue_type']]['value'] += option['ExitTypeCount']
                })
            },
            displayCounter(item) {
                return this.countersToShow.length === statistics.length || this.countersToShow.includes(item.key)
            },
            onChange(styles, item) {
                item.value = 0;
                this.data.WidgetLayout.allStatistics[item.key] = {
                    ...item,
                    ...styles
                }
                this.$emit('on-update', this.data)
            },
            initStatistics() {
                return {
                    [TOTAL_CALLS_KEY]: 0,
                    [PRIMARY_TYPE]: PRIMARY_COUNTERS(),
                    [PERCENTAGE_TYPE]: PERCENTAGE_COUNTERS(),
                }
            },
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }

            if (!this.data.WidgetLayout.ShowStatistics) {
                this.$set(this.data.WidgetLayout, 'ShowStatistics', statistics)
            }

            if (!this.data.WidgetLayout.allStatistics) {
                this.$set(this.data.WidgetLayout, 'allStatistics', this.initStatistics())
                this.queueStatistics = cloneDeep(this.initStatistics())
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function (value) {
                    this.queueStatistics = get(value, 'WidgetLayout.allStatistics')
                    this.getWidgetData()
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
    .statistic-card {
        @apply flex bg-white flex-wrap px-2 py-8 mt-1 mx-0-5 items-center justify-center rounded-lg shadow border border-primary text-primary;
        min-width: 340px;
    }
</style>
