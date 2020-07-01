<template>
    <div v-if="layout" class="global-layout__wrapper">
        <div class="pb-2">{{ $t('Default Layout') }}</div>
        <el-collapse>
            <el-collapse-item>
                <template slot="title">
                    <div class="flex flex justify-between w-full items-center">
                        <div class="flex justify-between w-full">
                            <div class="flex items-center">
                                <el-tooltip
                                    v-if="layout.LayoutID !== dashboardLayoutID"
                                    class="item" effect="dark" :content="$t('Apply layout')"
                                    placement="top">
                                    <CopyIcon
                                        class="w-4 text-primary" @click.stop="applyLayout(layout)"/>
                                </el-tooltip>
                                <el-tooltip
                                    v-else
                                    class="item" effect="dark" :content="$t('Current dashboard layout')"
                                    placement="top">
                                    <CheckCircleIcon
                                        class="w-4"/>
                                </el-tooltip>
                                <div class="px-2">{{layout.LayoutName}}</div>
                            </div>
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
    import {LayoutApi} from '@/api/layoutApi'
    import {CheckCircleIcon, CopyIcon} from 'vue-feather-icons'
    import LayoutWrapper from './LayoutWrapper'
    import {Collapse, CollapseItem, Tooltip} from 'element-ui'
    import {globalAccountSettings} from "@/views/LayoutManagement/layout-management";

    export default {
        components: {
            CopyIcon,
            LayoutWrapper,
            CheckCircleIcon,
            [Tooltip.name]: Tooltip,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            dashboardLayoutID: {
                type: [ String, Number ],
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
