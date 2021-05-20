<template>
    <div v-bind="$attrs">
        <el-time-picker v-bind="$attrs"
                        v-on="$listeners"
                        is-range
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="-"
                        prefix-icon="''"
                        start-placeholder="00:00"
                        end-placeholder="00:00"
        />
    </div>
</template>
<script>
    import { TimePicker } from 'element-ui'

    export default {
        components: {
            [TimePicker.name]: TimePicker,
        },
        props: {
            pickerOptions: {
                type: Object,
                default: () => ({
                    selectableRange: '00:00:00 - 23:59:59'
                }),
            },
        },
    }
</script>
<style lang="scss">
.el-date-editor .el-range-editor {
    padding: 3px 0 !important;
}
.el-range__icon, .el-range__close-icon {
    display: none !important;
}
.el-date-editor .el-range-input {
    width: 50% !important;
}

.el-time-range-picker > .el-time-range-picker__content {
    .el-time-spinner__item:not(.active):hover {
        @apply text-white bg-primary rounded-full;
    }
    .el-time-spinner__item.active {
        @apply text-primary;
    }
}
</style>
