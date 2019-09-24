<template>
    <div class="bg-white rounded-lg py-4 my-4 flex">
        <div v-for="(chart, index) in gaugeCharts"
             :key="index"
             class="w-full px-2 lg:w-1/3">
            <gauge-chart :chartData="chart"></gauge-chart>
        </div>
    </div>
</template>
<script>

    import GaugeChart from '@/components/Charts/GaugeChart'
    import {gaugeCharts} from '@/store/mockData'

    export default {
        components: {
            GaugeChart
        },
        data() {
            return {
                gaugeCharts: gaugeCharts
            }
        }
    };
</script>

<style lang="scss">
</style>
