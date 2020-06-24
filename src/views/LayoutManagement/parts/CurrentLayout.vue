<template>
    <div class="current-layout__wrapper px-5" v-if="layout">
        <p class="text-center pt-2">{{$t('Dashboard Layout')}}</p>
        <div class="pt-10 pb-4 flex flex-col border-b">
            <label class="pb-2">{{$t('Layout Name')}}</label>
            <div class="flex flex-row">
                <el-input v-model="layout.LayoutName"/>
                <div :class="$rtl.isRTL ? 'pr-4' : 'pl-4'">
                    <el-button
                        :disabled="storingData"
                        :loading="storingData"
                        @click="updateLayout(layout)"
                        type="primary">{{$t('common.save')}}
                    </el-button>
                </div>
            </div>
        </div>
        <layout-wrapper
            v-if="layout"
            class="px-2"
            :layout="layout"/>
    </div>
</template>
<script>

    import LayoutWrapper from './LayoutWrapper'
    import {LayoutApi} from "@/api/layoutApi";
    import get from "lodash/get";

    export default {
        components: {
            LayoutWrapper,
        },
        props: {
            dashboardLayoutID: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                layout: null,
                storingData: false,
            }
        },
        methods: {
            async getCurrentDashboardLayout() {
                try {
                    const dashboardLayoutID = this.dashboardLayoutID
                    const data = {
                        LayoutID: dashboardLayoutID
                    }
                    const layout = await LayoutApi.get(data)
                    this.layout = get(layout, '[0]', {})
                } catch (e) {
                    console.warn(e)
                } finally {
                }
            },
            async updateLayout(layoutConfig) {
                try {
                    this.storingData = true
                    await LayoutApi.update(layoutConfig)

                } catch (e) {
                    console.warn(e)
                } finally {
                    this.storingData = false
                }
            },
        },
        watch: {
            dashboardLayoutID: {
                immediate: true,
                handler() {
                    this.getCurrentDashboardLayout()
                }
            }
        }
    }
</script>
