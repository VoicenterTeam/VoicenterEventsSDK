<template>
    <div>
        <portal to="form-title">
            {{ $t('widget.widgetAdd') }}
        </portal>
        <div class="search">
            <div class="w-full flex justify-center py-4">
                <div class="w-full max-w-md">
                    <el-input
                        v-model="search"
                        :placeholder="$t('general.search')"
                        class="input-search"
                    >
                        <template v-slot:prefix>
                            <i class="el-input__icon vc-icon-search text-primary text-xl" />
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
        <div class="mt-2 text-gray-950 font-bold text-xl text-center">
            {{ $t('common.dashboards') }}
        </div>
        <DashboardList
            v-for="dashboard in searchedWidgetDashboardList"
            :key="dashboard.DashboardID"
            :dashboardItem="dashboard"
            @on-select-dashboard="onSelectDashboard"
        />
    </div>
</template>

<script>
import DashboardList from "@/components/Reports/Widgets/AddWidgetsForm/DashboardList"
import cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'dashboard-list-card',
    components: {
        DashboardList
    },
    data() {
        return {
            search: ''
        }
    },
    computed: {
        searchedWidgetDashboardList () {
            if (!this.search) {
                return this.dashboards
            }
            return this.dashboards.filter(dashboard => {
                return dashboard.DashboardTitle && dashboard.DashboardTitle.toLowerCase().includes(this.search.toLowerCase())
            })
        },
        dashboards () {
            return cloneDeep(this.$store.getters['dashboards/getAllDashboards'])
                .sort((a, b) => {
                    if(a.DashboardTitle < b.DashboardTitle) { return -1 }
                    if(a.DashboardTitle > b.DashboardTitle) { return 1 }
                    return 0
                })
        }
    },
    methods: {
        onSelectDashboard (dashboardID) {
            this.$emit('dashboard-selected', dashboardID)
        }
    },
    mounted () {
        this.search = ''
    }
}
</script>
