<template>
    <div>
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4">
            <highcharts :options="chartOptions"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import groupBy from 'lodash/groupBy'
    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import statusTypes from '@/enum/statusTypes'
    import {LOGOUT_STATUS} from "@/enum/extensionStatuses";

    export default {
        components: {
            TrashIcon,
            highcharts: Chart,
            [Tooltip.name]: Tooltip,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            extensions() {
                return this.$store.state.extensions.extensions
            },
            filteredExtensions() {
                let hideLoggedOutUsers = get(this.data.WidgetLayout, 'hideLoggedOutUsers')

                if (hideLoggedOutUsers) {
                    return this.extensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
                }
                return this.extensions
            },
            chartOptions() {
                let statusData = []
                let extensions = this.filteredExtensions

                if (extensions) {
                    statusData = groupBy(extensions, 'representativeStatus')
                }

                let data = []

                for (let status in statusData) {
                    let statusType = statusTypes[status]

                    let sliceObject = {
                        color: statusType.color,
                        name: this.$t(statusType.text),
                        y: statusData[status].length,
                    }

                    if (!data.length) {
                        sliceObject.sliced = true
                        sliceObject.selected = true
                    }

                    data.push(sliceObject);
                }

                return {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    series: [{
                        name: this.$t('Agents'),
                        colorByPoint: true,
                        data: data
                    }]
                };
            },
        },
    }
</script>
