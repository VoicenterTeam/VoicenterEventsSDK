<template>
    <div>
        <zoom-center-transition :duration="100">
            <Dashboard :account-no-data="accountNoData" v-show="!isContentLoading"/>
        </zoom-center-transition>
        <el-skeleton
            :loading="isContentLoading"
            animated
        >
            <template slot="template">
                <el-skeleton-item
                    variant="h3"
                    class="mb-3 w-full header-h"
                />
                <el-skeleton-item
                    variant="h3"
                    class="mb-10 w-full header-h"
                />
                <div
                    class="px-10 w-full"
                >
                    <el-skeleton-item
                        class="mb-4 widget-h"
                    />
                    <div
                        class="flex items-center"
                    >
                        <el-skeleton-item
                            variant="text"
                            class="mr-8 widget-h"
                        />
                        <el-skeleton-item
                            variant="text"
                            class="widget-h w-2/5"
                        />
                    </div>
                </div>
            </template>
        </el-skeleton>
    </div>
</template>
<script>
import { Skeleton, SkeletonItem } from 'element-ui'
    
    export default {
        components: {
            Dashboard: () => import('@/views/Dashboard'),
            [Skeleton.name]: Skeleton,
            [SkeletonItem.name]: SkeletonItem
        },
        computed: {
            accountNoData () {
                return !this.loadingData && !this.activeDashboard
            },
            activeDashboard () {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            loadingData () {
                return this.$store.state.dashboards.loadingData
            },
            isContentLoading () {
                return this.$store.state.dashboards.contentLoading
            }
        }
    }
</script>

<style lang="scss" scoped>
$widget-height: 380px;
$header-height: 64px;

.widget-h {
    height: $widget-height;
}
.header-h {
    height: $header-height;
}
</style>
