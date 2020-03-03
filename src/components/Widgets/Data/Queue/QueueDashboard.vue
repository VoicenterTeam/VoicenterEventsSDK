<template>
    <div>
        <div class="flex items-center">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="mt-2 flex flex-col">
            <div v-for="queueStatistic in queueStatistics"
                 class="flex w-full flex-col overflow-auto p-1 border rounded-lg mb-2 bg-primary-200">
                <div class="flex p-3 text-main-base">{{$t('Queue ID') +': '+ queueStatistic.queueID}}</div>
                <div class="flex">
                    <div v-for="item in queueStatistic[PRIMARY_TYPE]"
                         class="statistic-card" :style="item.style" v-if="displayCounter(item)">
                        <component :is="item.icon" class="text-primary w-5 h-5"></component>
                        <div class="px-2">{{startCase(item.label)}}</div>
                        <div class="text-sm">{{item.value}}</div>
                    </div>
                </div>
                <div class="flex pt-2">
                    <div v-for="item in queueStatistic[PERCENTAGE_TYPE]"
                         class="statistic-card" :style="item.style" v-if="displayCounter(item)">
                        <div>{{item.label}}</div>
                        <div class="px-2 text-sm">{{valueToDisplay(item.value, queueStatistic[TOTAL_CALLS_KEY])}}</div>
                    </div>
                    <div v-if="showSumOfOthers" class="statistic-card"
                         v-html="getSumOfOtherStatistics(queueStatistic[PERCENTAGE_TYPE], queueStatistic[TOTAL_CALLS_KEY])">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import sumBy from 'lodash/sumBy'
    import startCase from 'lodash/startCase'
    import {
        ADDITIONAL_DATA_KEY,
        BASE_COUNTERS,
        OTHER_STATISTIC_LABEL,
        PERCENTAGE_TYPE,
        PERCENTAGES,
        PRIMARY_TYPE,
        statistics,
        TOTAL_CALLS_KEY
    } from '@/enum/queueDashboardStatistics'
    import {getWidgetData} from '@/services/widgetService'

    export default {
        props: {
            data: Object,
            default: () => ({})
        },
        data() {
            return {
                fetchDataInterval: null,
                queueStatistics: null,
                ADDITIONAL_DATA_KEY,
                TOTAL_CALLS_KEY,
                PERCENTAGE_TYPE,
                BASE_COUNTERS,
                PRIMARY_TYPE,
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
            getSumOfOtherStatistics(queueData, totalCalls) {
                let countersToShow = this.countersToShow
                let hiddenStatistics = queueData.filter((el) => !countersToShow.includes(el.key))
                let sum = sumBy(hiddenStatistics, 'value')
                let percentage = `${((sum * 100) / totalCalls).toFixed(2)} %`

                return `<div class="px-2">${OTHER_STATISTIC_LABEL}</div><div>${percentage}</div>`
            },
            valueToDisplay(value, totalCalls) {
                let percentage = `${((value * 100) / totalCalls).toFixed(2)} %`
                if (!this.showAbsoluteNumbers) return percentage;
                return `(${value}) ${percentage}`
            },
            async getWidgetData() {
                try {
                    let data = await getWidgetData(this.data)
                    this.responseTransformer(data)
                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            responseTransformer(data) {
                let allCounters = []

                data.forEach((queue) => {

                    let counters = {
                        queueID: queue.queue_id,
                        [TOTAL_CALLS_KEY]: queue[TOTAL_CALLS_KEY],
                        [PRIMARY_TYPE]: [],
                        [PERCENTAGE_TYPE]: [],
                    }

                    Object.keys(queue).forEach((key) => {
                        if (!BASE_COUNTERS[key]) return;
                        let counter;

                        if (key === ADDITIONAL_DATA_KEY) {
                            counters.percentage = this.fetchAdditionalCounts(queue[ADDITIONAL_DATA_KEY])
                        } else {
                            let pair = {
                                value: queue[key],
                                key: key,
                            }
                            counter = {
                                ...BASE_COUNTERS[key],
                                ...pair,
                            }
                            counters.primary.push(counter)
                        }
                    })

                    allCounters.push(counters)
                    this.queueStatistics = allCounters.values()
                })
            },
            fetchAdditionalCounts(data) {
                return data.map((op) => {
                    let counter = PERCENTAGES[op['billing_cdr_queue_type']]
                    let pair = {
                        value: op['ExitTypeCount'],
                        key: op['billing_cdr_queue_type'],
                    }
                    return {
                        ...counter,
                        ...pair,
                    }
                })
            },
            displayCounter(item) {
                return this.countersToShow.length === statistics.length || this.countersToShow.includes(item.key)
            }
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)

                if (!this.data.WidgetLayout.ShowStatistics) {
                    this.$set(this.data.WidgetLayout, 'ShowStatistics', statistics)
                }
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
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
        @apply flex bg-white flex-wrap  px-6 py-4 mx-1 items-center justify-center rounded-lg shadow;
        min-width: 200px;
    }
</style>
