<template>
    <div :key="data.WidgetID" class="overflow-scroll flex flex-row">
        <div class="flex w-auto" v-for="(value, key) in counters" v-if="displayCounter(key)">
            <div :key="key" class="mx-1 py-2">
                <div :style="counterStyle[key]"
                     class="bg-white px-4 py-6 flex items-center justify-between rounded-lg shadow">
                    <div class="flex flex-col w-full items-center justify-center font-bold">
                        <div :style="getValueFontSize" class="mb-2">
                            {{value}}
                        </div>
                        <div :style="getTextFontSize" class="font-bold text-center">
                            {{$t(key)}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from "lodash/get";
    import {getWidgetData} from "@/services/widgetService";
    import {getDefaultTimeDelay} from "@/enum/generic";

    export default {
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
        data () {
            return {
                fetchDataInterval: null,
                counters: {},
                counterStyle: {
                    'Average duration of incoming calls': {
                        'color': '#5EB300',
                        'border': '2px solid #5EB300',
                    },
                    'Average duration of outgoing calls': {
                        'color': '#A0AEC0',
                        'border': '2px solid #A0AEC0',
                    },
                    'Average duration of all calls': {
                        'color': '#003B4D',
                        'border': '2px solid #003B4D',
                    }
                }
            }
        },
        computed: {
            getTextFontSize () {
                const fontSize = get(this.data, 'WidgetLayout.titleFontSize', '24')
                return {
                    'font-size': `${fontSize}px`
                }
            },
            getValueFontSize () {
                const fontSize = get(this.data, 'WidgetLayout.valueFontSize', '36')
                return {
                    'font-size': `${fontSize}px`
                }
            },
            countersToDisplay () {
                return get(this.data, 'WidgetLayout.showCounters', [])
            },
        },
        methods: {
            async getWidgetData () {
                try {
                    let data = await getWidgetData(this.data)
                    this.counters = data[0]
                } catch (e) {
                    console.warn(e)
                    let status = get(e, 'response.status')
                    if (status === 400) {
                        let refreshDelay = getDefaultTimeDelay()
                        this.$set(this.data, 'DefaultRefreshInterval', refreshDelay)
                    }
                } finally {
                }
            },
            displayCounter (key) {
                return this.countersToDisplay.includes(key)
            },
            showDefaultCards () {
                this.countersToDisplay.forEach((counter) => {
                    this.counters[counter] = '0:00:00'
                })
            }
        },
        mounted () {
            if (this.data.DefaultRefreshInterval) {
                this.fetchDataInterval = setInterval(() => {
                    this.getWidgetData()
                }, this.data.DefaultRefreshInterval)
            }

            if (!this.data.WidgetLayout.hasOwnProperty('showCounters')) {
                this.$set(this.data.WidgetLayout, 'showCounters', ['Average duration of all calls'])
            }

            this.showDefaultCards()
        },
        watch: {
            data: {
                immediate: true,
                handler: function () {
                    this.getWidgetData()
                }
            },
            editable: {
                immediate: true,
                handler: function () {
                    this.showDefaultCards()
                }
            }
        },
        beforeDestroy () {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval)
            }
        },
    }
</script>
