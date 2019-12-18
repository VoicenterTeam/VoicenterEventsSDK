<template>
    <div class="w-full bg-white px-8 py-4 my-4 flex items-center justify-between rounded-lg shadow">
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
            Endpoint: {
                type: String,
                default: ''
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
                    let data = WidgetDataApi.getData(this.EndPoint)
                    this.CounterValue = data.CounterValue
                } catch (e) {
                    console.warn(e)
                } finally {
                    this.loading = false
                    this.$emit('on-loading', false)
                }
            }
        },
        beforeMount() {
            this.getData()
            console.log(this.$attrs)
        }
    }
</script>
