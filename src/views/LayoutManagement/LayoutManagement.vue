<template>
    <div element-loading-background="transparent" v-loading="loading">
        <div class="flex flex-col">
            <div class="border-b px-16 flex flex-row justify-between h-14 items-center">
                <img :src="getLogo" alt="Logo" class="h-10">
                <div class="flex items-center">
                    <el-button
                        size="mini"
                        class="back-button"
                        @click="redirectBack">
                        <div class="flex items-center">
                            <ArrowLeftIcon class="w-4"/>
                            <span class="px-1 text-main-sm">{{$t('Back')}}</span>
                        </div>
                    </el-button>
                    <span class="mx-4 account-details">{{activeDashboard.DashboardTitle}}</span>
                    <span class="account-details">{{currentAccount.name}}</span>
                </div>
            </div>
            <div class="content-wrapper">
                <div class="w-1/2 px-2 bg-red-200">
                    {{activeDashboard}}
                </div>
                <div class="w-1/2 px-4 bg-green-200">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {ArrowLeftIcon} from 'vue-feather-icons'
    import {globalAccountSettings} from './layout-management-config'
    import {LayoutApi} from "@/api/layoutApi";

    export default {
        components: {
            ArrowLeftIcon
        },
        data() {
            return {
                loading: false,
            }
        },
        computed: {
            activeDashboard() {
                return this.$store.getters['dashboards/getActiveDashboard']
            },
            allDashboards() {
                return this.$store.state.dashboards.allDashboards
            },
            currentAccount() {
                return this.$store.getters['entities/getCurrentAccount']
            },
            getLogo() {
                return get(this.activeDashboard, 'DashboardLayout.settings.logo') || '/img/navbar/logo.png'
            },
            currentAccountId() {
                return this.$store.state.entities.selectedAccountID
            },
        },
        methods: {
            redirectBack() {
                this.$router.go(-1)
            },
            async getGlobalLayouts() {
                try {
                    let data = await LayoutApi.globals(globalAccountSettings)
                    console.log(JSON.stringify(data));
                } catch (e) {

                } finally {

                }
            }
        },
        mounted() {
            this.getGlobalLayouts()
        }
    }
</script>
<style lang="scss" scoped>
    .account-details {
        @apply text-main-sm text-gray-700 shadow-md py-2 px-3 rounded;
    }

    .back-button {
        @apply shadow-md border border-primary bg-transparent;
        padding: 2px 10px;
    }

    .content-wrapper {
        @apply px-12 py-6 flex flex-row w-full;
    }
    .el-loading-mask > .el-loading-spinner {
        @apply fixed;
    }
</style>
