<template>
    <div class="w-full bg-white px-8 py-4 -mt-2 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-row items-center justify-between">
            <slot name="title">
                <h5 class="text-2xl font-bold mx-3">
                    {{data.Title}}
                </h5>
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

    export default {
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
            getData() {
                try {
                    let data = WidgetDataApi.getExternalData(this.data.EndPoint)
                    this.CounterValue = data.CounterValue || data
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
