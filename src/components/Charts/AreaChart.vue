<template>
    <div>
        <div class="flex flex-row md:items-center justify-between">
            <p v-if="data.Title" class="text-main-2xl font-semibold">
                {{data.Title}}
            </p>
        </div>
        <div class="rounded-lg pt-2" v-if="chartVisibility">
            <highcharts class="chart-content_wrapper"
                        :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Chart} from 'highcharts-vue'
    import Highcharts from "highcharts";
    import {getWidgetData} from "@/services/widgetService";
    import {getDefaultTimeDelay} from "@/enum/generic";
    import Area from "highcharts/modules/accessibility";

    Area(Highcharts);

    export default {
        components: {
            Highcharts,
            highcharts: Chart,
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
        },
        data() {
            return {
                chartVisibility: true,
                fetchDataInterval: null,
                chartOptions: {},
            }
        },
        methods: {
            async getWidgetData() {
                try {

                    let Data = await getWidgetData(this.data)
                    this.chartOptions = get(Data, '0', {})

                    this.chartVisibility = false
                    this.$nextTick(() => {
                        this.chartVisibility = true
                    })
                } catch (e) {
                    console.warn(e)
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                }
            }
        },
        mounted() {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
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
<style scoped lang="scss">
    .chart-content_wrapper {
        max-height: 400px;
    }
</style>
