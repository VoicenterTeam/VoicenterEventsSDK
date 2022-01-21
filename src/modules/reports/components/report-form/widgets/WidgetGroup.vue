<template>
    <div class="border-b px-8 py-4 flex justify-between items-center -mx-4">
        <div class="flex flex-col truncate">
            <span class="text-2xl font-bold text-gray-950 leading-7">
                {{ getGroupName }}
            </span>
            <span class="truncate text-xs leading-4 font-normal mt-2">
                {{ getWidgetNames }}
            </span>
        </div>
        <el-tooltip :content="$t('general.addWidgetsInThisGroup')"
                    placement="top">
            <div class="flex font-bold text-primary leading-5 items-center cursor-pointer"
                 @click="onSelectGroup()">
            <span class="mx-2">
                {{ getWidgetLength }}
            </span>
            <IconShape/>
            </div>
        </el-tooltip>
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'

    export default {
        components: {
            [Tooltip.name]: Tooltip,
        },
        props: {
            group: {
                type: Object,
                default: () => ({}),
            },
            index: {
                type: Number || String,
                default: 0,
            }
        },
        computed: {
            getWidgetLength() {
                return this.group.WidgetList.length + ' ' + this.$t('Widgets')
            },
            getWidgetNames() {
                return this.group.WidgetList.map(el => el.Title).join(', ')
            },
            getGroupName() {
                return this.group.WidgetGroupTitle ? this.group.WidgetGroupTitle : `${this.$t('general.group')}: ${this.index}`
            }
        },
        methods: {
            onSelectGroup() {
                this.$emit('on-select-group')
            },
        },
    }
</script>
