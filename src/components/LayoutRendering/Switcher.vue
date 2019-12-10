<template>
    <div class="flex items-center layout-types__switcher"
         :class="this.$rtl ? 'm-margin__left-15' : 'm-margin__right-15'">
        <div class="flex mr-4">
            <p class="text-sm">{{$t('switcher.title')}}</p>
        </div>
        <div>
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.select.tabbed.view')" placement="top">
                <button class="btn shadow rounded bg-white mx-1 text-gray-300 hover:bg-primary-100 hover:text-primary"
                        @click="switching('tabbed')"
                        :class="{'text-primary': activeType === 'tabbed'}">
                    <IconTabbedView></IconTabbedView>
                </button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.select.list.view')" placement="top">
                <button class="btn shadow rounded bg-white mx-1 text-gray-300 hover:bg-primary-100 hover:text-primary"
                        @click="switching('normal')"
                        :class="{'text-primary': activeType === 'normal'}">
                    <IconNormalView></IconNormalView>
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
                default: 'normal'
            }
        },
        methods: {
            switching(type) {
                this.$emit('switch-layout', type)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .layout-types__switcher {
        color: var(--greyish-brown);
        font-size: 12px;
    }

    .rtl .layout-types__switcher div:first-child {
        margin-right: 0;
        @apply ml-4;
    }

    .m-margin__right-15 {
        margin-right: 0.875rem;
    }

    .m-margin__left-15 {
        margin-left: 0.875rem;
    }

</style>

