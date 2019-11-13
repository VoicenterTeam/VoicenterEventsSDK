<template>
    <div class="flex">
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.move.group.down')" placement="top">
            <ArrowDownIcon class="flex align-center w-6 h-6 mx-1 text-primary cursor-pointer"
                           @click="orderWidgetGroup('down')">
            </ArrowDownIcon>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.move.group.up')" placement="top">
            <ArrowUpIcon class="flex align-center w-6 h-6 mx-2 text-primary cursor-pointer"
                         @click="orderWidgetGroup('up')">
            </ArrowUpIcon>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('tooltip.remove.group')" placement="top">
            <Trash2Icon class="flex align-center w-6 h-6 mx-1 text-red cursor-pointer"
                        @click="$emit('remove-group', widgetGroup)">
            </Trash2Icon>
        </el-tooltip>
    </div>
</template>
<script>

    import {Tooltip} from 'element-ui'
    import {ArrowUpIcon, ArrowDownIcon, Trash2Icon} from 'vue-feather-icons'

    export default {
        name: "edit-group-buttons",
        components: {
            ArrowUpIcon,
            ArrowDownIcon,
            Trash2Icon,
            [Tooltip.name]: Tooltip
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            orderWidgetGroup(direction) {
                this.$emit('move-groups', {'widgetGroup': this.widgetGroup, 'direction': direction})
            }
        }
    }
</script>

<style scoped>

</style>
