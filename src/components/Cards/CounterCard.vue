<template>
    <div class="w-full bg-transparent px-8 py-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-row items-center justify-between">
            <slot name="content">
                <h2 class="flex w-full justify-end text-6xl font-bold mx-3">
                    <div v-html="result"/>
                </h2>
            </slot>
        </div>
    </div>
</template>
<script>
    import { WidgetDataApi } from '@/api/widgetDataApi'
    
    export default {
        components: {
            BaseWidgetTitle: () => import('@/components/BaseWidgetTitle')
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
                result: '',
                fetchDataInterval: null,
            }
        },
        methods: {
            async getData() {
                try {
                    this.result = await WidgetDataApi.getExternalData(this.data.EndPoint)
                } catch (e) {
                    console.warn(e)
                }
            },
            getDataWithRefreshInterval () {
                if (this.fetchDataInterval) {
                    clearInterval(this.fetchDataInterval)
                }
                if (this.data.DefaultRefreshInterval) {
                    this.fetchDataInterval = setInterval(async() => {
                        await this.getData()
                    }, this.data.DefaultRefreshInterval)
                }
            }
        },
        mounted() {
            this.getData()
        },
        beforeDestroy() {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getDataWithRefreshInterval()
                },
            },
        },
    }
</script>
