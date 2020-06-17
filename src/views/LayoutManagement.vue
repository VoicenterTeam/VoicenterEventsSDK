<template>
    <div class="flex flex-col">
        <div class="border-b px-16 flex flex-row justify-between h-14 items-center">
            <img :src="getLogo" alt="Logo" class="h-10">
            <div class="flex items-center">
                <el-button
                    size="mini"
                    class="custom-padding"
                    type="primary"
                    @click="redirectBack">
                    <div class="flex items-center">
                        <ArrowLeftIcon class="w-4"/>
                        {{$t('Back')}}
                    </div>
                </el-button>
                <span class="mx-4 account-details">{{activeDashboard.DashboardTitle}}</span>
                <span class="account-details">{{currentAccount.name}}</span>
            </div>
        </div>
        <div class="p-16">123</div>
    </div>
</template>
<script>
    import {ArrowLeftIcon} from 'vue-feather-icons'
    import get from "lodash/get";

    export default {
        components: {
            ArrowLeftIcon
        },
        data() {
            return {
                layouts: [
                    {
                        "LayoutID": "333",
                        "LayoutName": "Dark look dashboard",
                        "LayoutAccountID": "4000",
                        "LayoutParametersList": [
                            {
                                "JPath": "$setting.order",
                                "Value": "1",
                                "LayoutParameterID": "1",
                                "ParameterTypeName": "Text",
                                "LayoutParameterName": "Order",
                                "LayoutParameterValueID": "1"
                            }
                        ]
                    }
                ]
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
        },
        methods: {
            redirectBack() {
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .account-details {
        @apply text-main-sm text-gray-700 shadow-md py-2 px-3 rounded;
    }
    .custom-padding {
        padding: 2px 10px;
    }
</style>
