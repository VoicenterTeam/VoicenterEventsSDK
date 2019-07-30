<template>
    <div class="p-2 text-right range-filter">
        <el-date-picker
                v-model="value"
                v-on:change="updateDateRange"
                v-bind="$attrs"
                v-on="$listeners"
                type="datetimerange"
                :picker-options="pickerOptions"
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
                pickerOptions: {
                    shortcuts: [{
                        text: this.$t('range.filter.today'),
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, new Date()])
                        }
                    }, {
                        text: this.$t('range.filter.last_week'),
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, new Date()])
                        }
                    }, {
                        text: this.$t('range.filter.last_month'),
                        onClick(picker) {
                            let start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, new Date()])
                        }
                    }, {
                        text: this.$t('range.filter.last_year'),
                        onClick(picker) {
                            picker.$emit('pick', [new Date(new Date().getFullYear(), 0, 1), new Date()])
                        }
                    }]
                },
                value: ['', ''],
            }
        },
        methods: {
            updateDateRange() {
                let range = this.value ? this.value.join(' - ') : ''
                this.$emit('on-change', range)
            },
        },
        mounted() {
            this.value = [new Date(this.date[0]), new Date(this.date[1])]
        },
    }
</script>
<style lang="scss" scoped>
    .range-filter /deep/ {
        .el-range-separator {
            padding: 0;
        }
    }

</style>

<style lang="scss">
    .el-date-table td.end-date span, .el-date-table td.start-date span {
        background-color: var(--primary-color);
    }

    .el-date-table td.today span {
        color: var(--primary-color);
    }
</style>
