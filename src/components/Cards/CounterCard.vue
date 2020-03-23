<template>
    <div class="w-full bg-white px-8 py-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-row items-center justify-between">
            <slot name="title">
                <base-widget-title :title="data.Title"/>
            </slot>
            <slot name="content">
                <h2 class="text-6xl font-bold mx-3 text-green">
                    {{CounterValue}}
                </h2>
            </slot>
        </div>
    </div>
</template>
<script>
    import {WidgetDataApi} from '@/api/widgetDataApi'
    import BaseWidgetTitle from "@/components/BaseWidgetTitle";

    export default {
        components: { BaseWidgetTitle },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                CounterValue: 0,
            }
        },
        methods: {
            async getData() {
                try {
                    let data = await WidgetDataApi.getExternalData(this.data.EndPoint)
                    this.CounterValue = data.CounterValue || '--'
                } catch (e) {
                    console.warn(e)
                }
            }
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getData()
                }
            }
        },
    }
</script>
