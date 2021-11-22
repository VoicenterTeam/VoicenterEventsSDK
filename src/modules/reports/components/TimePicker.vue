<template>
    <div v-bind="$attrs">
        <el-time-select v-bind="$attrs"
                        v-on="$listeners"
                        :picker-options="pickerOptions"
                        :placeholder="$attrs.placeholder || '00:00'"
        />
    </div>
</template>
<script>
    import { TimeSelect } from 'element-ui'
    
    export default {
        components: {
            [TimeSelect.name]: TimeSelect,
        },
        props: {
            pickerOptions: {
                type: Object,
                default: () => ({
                    start: '00:15',
                    step: '00:15',
                    end: '23:45',
                }),
            },
        },
    }
</script>
<style lang="scss">
.el-picker-panel .el-scrollbar .el-picker-panel__content .el-scrollbar__view {
    .time-select-item:hover, .selected {
        background-color: rgba(var(--primary_rgba-color), 0.15);
        color: var(--primary-color);
    }
}
</style>
