<template>
    <div class="range-filter">
        <el-date-picker
            v-model="value"
            v-on:change="updateDateRange"
            v-bind="$attrs"
            v-on="$listeners"
            type="daterange"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :align="align">
        </el-date-picker>
    </div>
</template>
<script>
    import {DatePicker} from 'element-ui'

    export default {
        components: {
            [DatePicker.name]: DatePicker,
        },
        props: {
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
                default: 'right'
            },
        },
        data() {
            return {
                value: this.date,
            }
        },
        methods: {
            updateDateRange() {
                this.$emit('on-change', this.value)
            },
        },
    }
</script>
<style lang="scss" scoped>
    .range-filter /deep/ {
        .el-range-separator {
            padding: 0;
        }
    }

    .range-filter /deep/ .el-date-editor--daterange {
        width: 100%;
    }
</style>
