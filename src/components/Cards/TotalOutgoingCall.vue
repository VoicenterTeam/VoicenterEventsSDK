<template>
<!--    <div class="bg-white px-4 py-4 flex justify-between rounded-lg shadow">-->
<!--        <h2 class="text-4xl font-bold -my-2">-->
<!--            {{counter || '&#45;&#45;'}}-->
<!--        </h2>-->
<!--    </div>-->
    <base-wrapper
        v-bind="$attrs"
        v-on="$listeners"
        :cardValue="cardValue"
        :showText="false"
        :cardIcon="null"
        :cardText="null"
        :styles="{}"
        @show-modal="onShowModal"
    />
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
                cardValue: null
            }
        },
        methods: {
            get,
            async chartOptions() {

                try {
                    let Data = await getWidgetData(this.data)
                    this.cardValue = get(Data, "[0]['Total Outgoing Calls']")
                } catch (e) {
                    console.log(e)
                }
            },
            onShowModal() {
                console.log('onShowModal')
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
