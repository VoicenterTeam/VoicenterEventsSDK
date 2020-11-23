<template>
    <div class="current-layout__wrapper px-5" v-if="layout">
        <div class="flex text-center text-2xl items-center pt-2 justify-center">
            <p>{{$t('Active Layout')}}:</p>&nbsp;
            <p class="text-primary">{{layout.LayoutName}}</p>
        </div>
        <div class="pt-10 pb-4 flex flex-col border-b">
            <label class="pb-2">{{$t('Layout Name')}}</label>
            <div class="flex flex-row items-center">
                <el-input v-model="layout.LayoutName"/>
                <div v-if="layout.LayoutID !== DEFAULT_LAYOUT_ID" :class="$rtl.isRTL ? 'pr-4' : 'pl-4'">
                    <el-button
                        :disabled="storingData"
                        :loading="storingData"
                        @click="updateLayout(layout)"
                        type="primary">{{$t('Update')}}
                    </el-button>
                </div>
                <div v-else :class="$rtl.isRTL ? 'pr-4' : 'pl-4'">
                    <el-popover
                        placement="bottom-start"
                        trigger="hover">
                        <div>
                            {{$t('This is a default config, please add a new one if you want to edit it')}}
                        </div>
                        <AlertTriangleIcon class="text-orange-500 cursor-help" slot="reference"></AlertTriangleIcon>
                    </el-popover>
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
    import get from 'lodash/get'
    import { Popover } from 'element-ui'
    import { LayoutApi } from '@/api/layoutApi'
    import LayoutWrapper from 'src/views/DashboardSettings/LayoutManagement/parts/LayoutWrapper'
    import { DEFAULT_LOGO } from 'src/views/DashboardSettings/LayoutManagement/layout-management'
    import { DEFAULT_LAYOUT_ID } from '@/enum/generic'
    import { AlertTriangleIcon } from 'vue-feather-icons'
    import { globalAccountSettings } from "@/views/DashboardSettings/LayoutManagement/layout-management";

    export default {
        components: {
            [Popover.name]: Popover,
            AlertTriangleIcon,
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
                DEFAULT_LAYOUT_ID,
            }
        },
        methods: {
            dashboardLogo() {
                try {
                    const logo = this.layout.LayoutParametersList.filter((el) => el.LayoutParameterName === 'DashboardLogo')
                    return get(logo, `[0]['ValueText']`, DEFAULT_LOGO);
                } catch (e) {
                    return DEFAULT_LOGO
                }
            },
            async getCurrentDashboardLayout() {
                try {
                    const dashboardLayoutID = this.dashboardLayoutID

                    const data = {
                        LayoutID: dashboardLayoutID
                    }

                    let layout = await LayoutApi.get(data)

                    if (layout.length) {
                        this.layout = get(layout, '[0]', {})
                        return
                    }

                    layout = await LayoutApi.get(globalAccountSettings)
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

                    this.$store.commit('layout/SET_ACTIVE_LAYOUT', layoutConfig)
                    this.$emit('refresh-layouts')
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
