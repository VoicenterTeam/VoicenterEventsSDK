<template>
    <div class="date-picker">
        <el-date-picker v-bind="$attrs"
                        v-on="$listeners"
                        :picker-options="pickerOptions"
        />
    </div>
</template>
<script>
    import { DatePicker } from 'element-ui'
    
    export default {
        components: {
            [DatePicker.name]: DatePicker,
        },
        props: {
            pickerOptions: {
                type: Object,
                default: () => ({}),
            },
            type: {
                type: String,
                default: 'date',
            },
        },
    }
</script>
<style lang="scss" scoped>
.date-picker ::v-deep {
    .el-date-editor, .el-date-editor--data {
        width: 100%;
    }
}
</style>
