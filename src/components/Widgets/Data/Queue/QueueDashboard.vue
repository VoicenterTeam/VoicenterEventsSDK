<template>
    <div>
        <div class="flex items-center">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white rounded-lg mt-4 p-4">
        </div>
    </div>
</template>
<script>
    import {getWidgetData} from '@/services/widgetService'

    export default {
        props: {
            data: Object,
            default: () => ({})
        },
        data() {
            return {
                fetchDataInterval: null
            }
        },
        methods: {
            async getWidgetData() {
                // try {

                let data = await getWidgetData(this.data)
                console.log(data)
                // } catch (e) {
                //     console.warn(e)
                // } finally {
                // }
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

</style>
