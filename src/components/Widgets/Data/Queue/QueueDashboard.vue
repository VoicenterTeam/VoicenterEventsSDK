<template>
    <div>
        <div class="flex items-center">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="flex flex-wrap -mx-1">
                <div v-for="item in queueStatistics[PRIMARY_TYPE]"
                     class="statistic-card" :style="item.style" v-if="displayCounter(item)">
                    <component :is="item.icon" class="text-primary w-5 h-5"></component>
                    <div class="px-2">{{startCase(item.label)}}</div>
                    <div class="text-sm">{{item.value}}</div>
                </div>
                <div v-for="item in queueStatistics[PERCENTAGE_TYPE]"
                     class="statistic-card mb-1" :style="item.style" v-if="displayCounter(item)">
                    <div>{{item.label}}</div>
                    <div class="px-2 text-sm">{{valueToDisplay(item.value, queueStatistics[TOTAL_CALLS_KEY])}}</div>
                </div>
                <div v-if="showSumOfOthers" class="statistic-card"
                     v-html="getSumOfOtherStatistics()">
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
        OTHER_STATISTIC_LABEL,
        PERCENTAGE_COUNTERS,
        PRIMARY_COUNTERS,
        PERCENTAGE_TYPE,
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
            initStatistics() {
                this.queueStatistics = {
                    [TOTAL_CALLS_KEY]: 0,
                    [PRIMARY_TYPE]: PRIMARY_COUNTERS(),
                    [PERCENTAGE_TYPE]: PERCENTAGE_COUNTERS(),
                }
            },
            startCase,
            getSumOfOtherStatistics() {
                let queueData = this.queueStatistics[PERCENTAGE_TYPE]

                let totalCalls = this.queueStatistics[TOTAL_CALLS_KEY]
                let countersToShow = this.countersToShow
                let hiddenStatistics = []

                Object.keys(queueData).forEach((key) => {
                    if (!countersToShow.includes(key)) {
                        hiddenStatistics.push( queueData[key])

                    }
                })

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
                    this.initStatistics()
                    let data = await getWidgetData(this.data)
                    this.composeStatistics(data)
                } catch (e) {
                    console.warn(e)
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
        @apply flex bg-white flex-wrap px-6 py-4 mx-0-5 items-center justify-center rounded-lg shadow;
        min-width: 200px;
    }
</style>
