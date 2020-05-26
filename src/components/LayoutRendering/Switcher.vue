<template>
    <div class="flex items-center">
        <div class="flex">
            <p class="text-main-sm">{{$t('switcher.title')}}</p>
        </div>
        <div class="flex">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.select.tabbed.view')" placement="top">
                <button class="btn shadow rounded bg-white mx-1 text-gray-300 hover:bg-primary-100 hover:text-primary"
                        @click="switching('tabbed')"
                        :class="{'text-primary': activeType === 'tabbed'}">
                    <IconTabbedView/>
                </button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.select.list.view')" placement="top">
                <button class="btn shadow rounded bg-white mx-1 text-gray-300 hover:bg-primary-100 hover:text-primary"
                        @click="switching('list')"
                        :class="{'text-primary': activeType === 'list'}">
                    <IconListView/>
                </button>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
    import {Tooltip} from 'element-ui'

    export default {
        name: 'layout-switcher',
        inheritAttrs: false,
        components: {
            [Tooltip.name]: Tooltip
        },
        props: {
            activeType: {
                type: String,
                default: 'list'
            }
        },
        methods: {
            switching(type) {
                this.$emit('switch-layout', type)
            }
        }
    }
</script>
