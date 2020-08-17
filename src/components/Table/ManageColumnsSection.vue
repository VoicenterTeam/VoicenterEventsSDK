<template>
    <div class="manage-columns-section">
        <div class="flex justify-between items-center manage-columns-section-header">
            <el-tooltip class="item" effect="dark"
                        v-if="availableColumns.length"
                        :content="allChecked ? $t('datatable.manage.uncheck.all') : $t('datatable.manage.check.all')"
                        placement="top">
                <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                             v-model="allChecked"/>
            </el-tooltip>
            <slot name="search"/>
            <slot name="button"
                  :allChecked="allChecked"
                  :columns="checkedColumns"/>
        </div>
        <div class="manage-columns-section-content">
            <el-checkbox-group class="flex flex-col column-checkbox" v-model="checkedColumns"
                               @change="handleCheckedColumnsChange">
                <draggable
                    v-bind="dragOptions"
                    class="flex flex-col columns-section-container"
                    :list="availableColumns"
                    group="columns"
                    @change="onChange">
                    <el-checkbox class="py-2 px-4" v-for="column in availableColumns" :label="column.prop"
                                 :key="column.label"><i class="el-icon-rank text-primary font-bold"/>
                        {{$t(column.label)}}
                    </el-checkbox>
                </draggable>
            </el-checkbox-group>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import { Checkbox, CheckboxGroup, Option, Select, Tooltip } from 'element-ui'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            [Tooltip.name]: Tooltip,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            draggable,
        },
        data() {
            return {
                isIndeterminate: false,
                checkedColumns: [],
                allChecked: false,
            }
        },
        props: {
            availableColumns: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    ghostClass: 'moving-columns',
                    swapThreshold: 0.8,
                    drag: true,
                }
            },
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedColumns = val ? this.availableColumns.map(c => c.prop) : []
                this.isIndeterminate = false
            },
            handleCheckedColumnsChange(val) {
                let checkedCount = val.length
                this.allChecked = checkedCount === this.availableColumns.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.availableColumns.length
            },
            onChange(evt) {
                this.$emit('onChange', evt)
            },
        },
    }
</script>
<style scoped lang="scss">
    .manage-columns-section-header {
        height: 60px;
        @apply px-4;
    }

    .manage-columns-section-content {
        overflow: auto;
        min-height: 200px;
        max-height: 250px;
    }

    .items-selected {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--charcoal-grey);
    }

    .manage-columns-section {
        max-height: 300px;
        min-width: 350px;
        overflow-y: auto;
    }

    .manage-columns-section + .manage-columns-section {
        border-left: solid 1px var(--silver-color);
    }

    .search-columns /deep/ input {
        height: 32px;
        border-radius: 4px;
        border: solid 1px var(--silver-color);
        font-size: 12px;
        color: #4b4d56;
    }

    .search-columns /deep/ .el-input__suffix .el-input__icon {
        line-height: 32px;
    }

    .column-checkbox /deep/ .el-checkbox, .manage-columns-section-header /deep/ .el-checkbox {
        margin-right: 0;

        .el-checkbox__input > .el-checkbox__inner {
            height: 18px;
            width: 18px;

            &::after {
                border-width: 2px;
                height: 10px;
                left: 6px;
            }

            &::before {
                height: 5px;
            }
        }
    }

    .column-checkbox /deep/ .el-checkbox.is-checked {
        background-color: var(--bg-grey-modal);
    }

    .rtl {
        .column-checkbox .el-checkbox:last-child {
            margin: 0;
        }

        .manage-columns-section + .manage-columns-section {
            border-left: none;
            border-right: solid 1px var(--silver-color);
        }
    }

    @media (max-width: 640px) {
        .manage-columns-section + .manage-columns-section {
            border-top: solid 1px var(--silver-color);
        }
    }

    .moving-columns {
        @apply opacity-50 bg-gray-100 border border-primary cursor-move;
    }

    .columns-section-container {
        min-height: 200px;
    }
</style>
