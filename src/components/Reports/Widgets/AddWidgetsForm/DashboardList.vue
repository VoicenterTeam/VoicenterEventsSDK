<template>
    <div v-loading.lock="loadData">
        <div
            class="py-2 bg-white flex items-center border-b"
            @click="onSelectDashboard"
            :class="{ 'opacity-25 cursor-not-allowed': !getGroupsListLength, 'cursor-pointer': getGroupsListLength }"
        >
            <div class="flex items-center justify-between w-full py-4 px-2.5 text-steel">
                <div class="flex items-center flex-1">
                    <div>
                        <slot name="title">
                            <p class="text-2xl font-bold text-gray-950">
                                {{ dashboardTitle }}
                            </p>
                        </slot>
                    </div>
                    <slot name="state-icon"/>
                </div>
                <div class="flex items-center text-primary">
                    <span class="mx-3 font-bold text-base">
                        {{ getGroupsListLength }}
                        {{ setWidgetTranslation }}
                    </span>
                    <IconShapeMini/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import get from 'lodash/get'

export default {
    name: 'dashboard-list',
    props: {
        dashboardItem: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            dashboardData: {},
            loadData: false
        }
    },
    mounted () {

    },
    methods: {
        get,
        onSelectDashboard () {
            if (!this.getGroupsListLength) {
                return
            }
            this.loadData = true
            this.$emit('on-select-dashboard', this.dashboardItem.DashboardID)
        }
    },
    computed: {
        dashboardTitle () {
            return this.dashboardItem.DashboardTitle
        },
        getGroupsListLength () {
            return get(this.dashboardItem, 'WidgetGroupsLength', 0)
        },
        setWidgetTranslation () {
            return this.getGroupsListLength === 1 ? this.$t('general.group') : this.$t('general.groups')
        }
    },
    beforeDestroy () {
        this.loadData = false
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-loading-spinner {
    margin-top: -70px !important;
}
</style>