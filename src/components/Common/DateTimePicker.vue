<template>
    <div class="range-filter">
        <el-date-picker
            v-model="value"
            v-on:change="updateDateRange"
            v-bind="$attrs"
            v-on="$listeners"
            :type="type"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :align="align"
            prefix-icon="vc-icon-schedule-calendar"
            clear-icon="vc-icon-ticket-closed">
        </el-date-picker>
    </div>
</template>
<script>
    import { DatePicker } from 'element-ui'
    
    export default {
        components: {
            [DatePicker.name]: DatePicker
        },
        props: {
            type: {
                type: String,
                default: 'daterange'
            },
            date: {
                type: Array,
                default: () => []
            },
            rangeSeparator: {
                type: String,
                default: function () {
                    return this.$t('range.filter.to')
                }
            },
            startPlaceholder: {
                type: String,
                default: function () {
                    return this.$t('range.filter.start')
                }
            },
            endPlaceholder: {
                type: String,
                default: function () {
                    return this.$t('range.filter.end')
                }
            },
            align: {
                type: String,
                default: 'left'
            }
        },
        data() {
            return {
                value: this.date
            }
        },
        mounted () {
            const dates = this.value.map(el => new Date(el))
            this.$emit('on-change', dates)
        },
        methods: {
            updateDateRange() {
                this.$emit('on-change', this.value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.range-filter /deep/ {
    .el-range-separator {
        padding: 0;
    }
}

.range-filter /deep/ {
    .el-date-editor--daterange {
        width: 100%;
    }
    
    .el-date-editor--data {
        width: 100%;
    }
}
::v-deep .el-input__icon.el-range__icon.vc-icon-schedule-calendar {
    @apply text-primary text-base cursor-pointer leading-8;
}
::v-deep .el-input__icon.el-range__close-icon {
    @apply text-primary text-base cursor-pointer leading-8;
}
</style>
