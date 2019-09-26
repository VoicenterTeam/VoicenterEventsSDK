<template>
    <div class="w-full p-4 bg-white rounded-lg shadow">
        <div class="relative cursor-pointer z-50" v-if="editable">
            <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.widget')" placement="top">
                <trash-icon class="w-8 h-8 p-2 text-red trash-icon"
                            @click="$emit('remove-item')"></trash-icon>
            </el-tooltip>
        </div>
        <div class="z-10" :class="{'-mt-8':editable}">
            <highcharts :options="data"></highcharts>
        </div>
    </div>
</template>
<script>

    import {Tooltip} from 'element-ui'
    import Highcharts from 'highcharts'
    import {Chart} from 'highcharts-vue'
    import {TrashIcon} from 'vue-feather-icons'
    import highchartsMoreInit from 'highcharts/highcharts-more'

    highchartsMoreInit(Highcharts)

    export default {
        components: {
            highcharts: Chart,
            TrashIcon,
            [Tooltip.name]: Tooltip
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style lang="scss">
</style>
