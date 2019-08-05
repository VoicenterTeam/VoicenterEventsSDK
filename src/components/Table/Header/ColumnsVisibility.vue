<template>
    <div>
        <div class="border-b-2 flex pb-3">
            <div class="mx-4 flex">
                <el-checkbox class="flex" :indeterminate="isIndeterminate" v-model="checkAll"
                             @change="handleCheckAllChange">
                </el-checkbox>
                <div class="flex border-b">
                    <input class="text-sm appearance-none w-32 bg-transparent border-none focus:outline-none"
                           type="text"
                           :placeholder="$t('datatable.filter')"
                           v-model="columnSearchQuery">
                </div>
            </div>
        </div>
        <el-checkbox-group class="flex flex-col" v-model="checkedColumns"
                           @change="handleCheckedColumnsChange">
            <el-checkbox class="py-2 mx-4" v-for="column in filteredColumns" :label="column.prop"
                         :key="column.label">{{column.label}}
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>

    import {Checkbox, CheckboxGroup} from 'element-ui'

    export default {
        name: 'columns-visibility',
        components: {
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
        },
        data() {
            return {
                checkAll: true,
                checkedColumns: [],
                isIndeterminate: false,
                columnSearchQuery: '',
            };
        },
        props: {
            availableColumns: {
                type: Array,
                default: () => []
            },
            visibleColumns: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            filteredColumns() {
                if (!this.columnSearchQuery) {
                    return this.availableColumns
                }
                return this.availableColumns.filter(item => {
                    return item.label.toLowerCase().includes(this.columnSearchQuery.toLowerCase())
                })
            },
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedColumns = val ? this.visibleColumns : [];
                this.isIndeterminate = false;
                this.$emit('on-change-visibility', this.checkedColumns)
            },
            handleCheckedColumnsChange(val) {
                let checkedCount = val.length;
                this.checkAll = checkedCount === this.availableColumns.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.availableColumns.length;
                this.$emit('on-change-visibility', val)
            },
        },
        watch: {
            visibleColumns: {
                handler: function (visibleColumns) {
                    this.checkedColumns = visibleColumns
                },
                immediate: true
            },
        }
    }

</script>

<style lang="scss">

    .el-checkbox__input.is-checked {
        + .el-checkbox__label {
            color: var(--primary-color) !important;
        }

        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: var(--primary-color) !important;
            border-color: var(--primary-color) !important;
        }
    }

    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
    }
    .rtl .el-checkbox:last-child {
        margin-right: 30px;
    }

</style>
