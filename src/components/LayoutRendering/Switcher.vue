<template>
    <div class="flex items-center">
        <template v-if="!editMode">
            <el-tooltip effect="dark"
                        :content="$t('tooltip.select.tabbed.view')"
                        :open-delay="openDelay"
                        placement="top">
                <button class="focus:outline-none mx-1 text-gray-300 hover:text-primary"
                        @click="switching('tabbed')"
                        :class="{'text-primary': activeType === 'tabbed'}">
                    <IconTabbedView/>
                </button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        :content="$t('tooltip.select.list.view')"
                        :open-delay="openDelay"
                        placement="top">
                <button class="focus:outline-none mx-1 text-gray-300 hover:text-primary"
                        @click="switching('list')"
                        :class="{'text-primary': activeType === 'list'}">
                    <IconListView/>
                </button>
            </el-tooltip>
            <IconHorisontalLine class="py-2-5 mx-4"/>
            <el-tooltip effect="dark"
                        :content="$t('dashboard.onFullScreenMode')"
                        placement="top">
                <button class="focus:outline-none mx-1 text-gray-300 hover:text-primary"
                        @click="onFullScreen">
                    <IconFullScreen/>
                </button>
            </el-tooltip>
        </template>
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'
    import { EditIcon } from 'vue-feather-icons'
    
    export default {
        name: 'layout-switcher',
        inheritAttrs: false,
        components: {
            EditIcon,
            [Tooltip.name]: Tooltip,
        },
        props: {
            activeType: {
                type: String,
                default: 'list',
            },
            editMode: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                openDelay: 200,
            }
        },
        methods: {
            switching(type) {
                this.$emit('switch-layout', type)
            },
            onFullScreen() {
                this.$emit('on-fullscreen')
            },
        },
    }
</script>
