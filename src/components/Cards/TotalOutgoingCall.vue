<template>
    <div class="bg-white px-4 py-4 flex justify-between rounded-lg shadow">
        <h2 class="text-4xl font-bold -my-2">
            {{counter || '--'}}
        </h2>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {getWidgetData} from "@/services/widgetService";

    export default {
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {},
        data() {
            return {
                fetchDataInterval: null,
                counter: null
            }
        },
        methods: {
            get,
            async chartOptions() {

                try {
                    let Data = await getWidgetData(this.data)
                    this.counter = get(Data, "[0]['Total Outgoing Calls']")
                } catch (e) {
                    console.log(e)
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
                    this.chartOptions()
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
