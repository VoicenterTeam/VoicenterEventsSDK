<template>
    <div v-if="layout" class="global-layout__wrapper">
        <div class="pb-2">{{ $t('Default Layout') }}</div>
        <el-collapse>
            <el-collapse-item>
                <template slot="title">
                    <div class="flex flex justify-between w-full items-center">
                        <div class="flex justify-between w-full items-center"
                             v-if="layout.LayoutID !== dashboardLayoutID">
                            <div class="flex justify-between w-full items-center">
                                <div class="p-2">{{layout.LayoutName}}</div>
                                <div class="flex items-center">
                                    <el-tooltip
                                        class="item" effect="dark" :content="$t('Apply layout')"
                                        placement="top">
                                        <div class="px-2 text-green-600 underline hover:text-green-300"
                                             @click.stop="applyLayout(layout)">
                                            {{$t('Activate this Layout')}}
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex justify-between w-full items-center text-primary">
                            <div class="flex items-center">
                                <el-tooltip
                                    class="item" effect="dark" :content="$t('Current dashboard layout')"
                                    placement="top">
                                    <CheckCircleIcon
                                        class="w-4"/>
                                </el-tooltip>
                                <div class="px-2">{{layout.LayoutName}}</div>
                            </div>
                            <div class="px-2">{{$t('Active Layout')}}</div>
                        </div>
                    </div>
                </template>
                <layout-wrapper :layout="layout"/>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { LayoutApi } from '@/api/layoutApi'
    import { CheckCircleIcon } from 'vue-feather-icons'
    import LayoutWrapper from 'src/views/DashboardSettings/LayoutManagement/parts/LayoutWrapper'
    import { Collapse, CollapseItem, Tooltip } from 'element-ui'
    import { globalAccountSettings } from "@/views/DashboardSettings/LayoutManagement/layout-management";

    export default {
        components: {
            LayoutWrapper,
            CheckCircleIcon,
            [Tooltip.name]: Tooltip,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            dashboardLayoutID: {
                type: [String, Number],
                default: null
            }
        },
        data() {
            return {
                layout: null
            }
        },
        methods: {
            async getDefaultLayout() {
                try {
                    const globalLayout = await LayoutApi.get(globalAccountSettings)
                    this.layout = get(globalLayout, '[0]', {})
                } catch (e) {
                    this.layout = []
                    console.warn(e)
                } finally {
                }
            },
            applyLayout(layout) {
                this.$emit('on-apply-layout', layout)
            }
        },
        created() {
            this.getDefaultLayout()
        },
    }
</script>
<style lang="scss" scoped>
    .global-layout__wrapper {
        div.el-collapse {
            .el-collapse-item {
                @apply border border-primary rounded-t;
            }
        }
    }
</style>
