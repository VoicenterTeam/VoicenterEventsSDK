<template>
    <div>
        <div class="flex flex-col report-wrapper h-full">
            <div class="h-10 flex items-center justify-between w-full header text-gray-500">
                <div class="flex items-center">
                    <img :src="getLogo"
                         alt="Logo"
                         class="h-5 mx-8"
                    />
                    <span class="leading-4 font-medium text-xs">
                        {{ $t('report.report№') }}2215
                    </span>
                </div>
                <div class="flex flex-col mr-5 items-end leading-2 font-semibold text-xxs">
                    <span>
                        Cameron Williamson
                    </span>
                    <span>
                        12.02.2021  17:05
                    </span>
                </div>
            </div>
            <div class="w-full flex justify-center py-4 text-sm leading-4 font-semibold dark-gray">
                {{ dashboard.DashboardTitle }}
            </div>
            <WidgetList :widget-group-list="dashboard.WidgetGroupList"/>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import WidgetList from '@/modules/reports/types/pdf/widget-list'
    import { DashboardApi } from '@/api/dashboardApi'
    
    import ListView from '@/components/LayoutRendering/Types/ListView'
    
    export default {
        components: {
            WidgetList,
            ListView,
        },
        data() {
            return {
                columnsToDisplay: 6,
                columnMinWidth: 122,
                isReport: true,
                dashboard: {
                    WidgetGroupList: [],
                },
            }
        },
        computed: {
            getLogo() {
                return this.$store.getters['layout/getLogo']
            },
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            widgetGroups() {
                return get(this.activeDashboard, 'WidgetGroupList', [])
            },
        },
        methods: {
            async tryGetDashboard() {
                const { dashboardID } = this.$route.query
                if (!dashboardID) {
                    return
                }
                await this.getDashboardData(dashboardID)
            },
            async getDashboardData(dashboardID) {
                this.dashboard = await DashboardApi.find(dashboardID)
            },
        },
        created() {
            window.grids = []
        },
        mounted() {
            this.tryGetDashboard()
        },
    }
</script>
<style lang="scss">
.report-wrapper {
    width: 800px;
    @apply font-normal;
}

.header {
    @apply bg-white border-b border-gray-300;
}

.text-xxs {
    font-size: 9px;
    letter-spacing: 0.03em
}

.text-xsm {
    font-weight: 500;
    font-size: 10px;
    line-height: 145%;
}

.dark-gray {
    color: var(--dark-gray);
}

.el-table th {
    font-size: 10px;
    font-weight: bold;
    padding: 0;
    line-height: 10px;
}

.el-table td {
    padding: 5px 0;
    font-size: 10px;
    
    > div.cell {
        overflow-wrap: normal;
        word-break: normal;
    }
}

.chart-content_wrapper {
    max-height: 100% !important;
    min-height: 100% !important;
}
</style>
