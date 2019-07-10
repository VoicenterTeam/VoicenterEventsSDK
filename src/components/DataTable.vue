<template>
    <div class="bg-white py-10 rounded-lg shadow">
        <div class="flex justify-end mx-4">
            <div class="my-4">
                <el-select
                        v-model="columnList"
                        value-key="prop"
                        multiple
                        filterable
                        collapse-tags
                        default-first-option
                        size="large"
                        :placeholder="$t('common.selectColumn')">
                    <el-option
                            v-for="item in optionColumns"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <el-table ref="table"
                  stripe
                  row-key="id"
                  :key="tableKey"
                  :data="tableData"
                  v-bind="$attrs"
                  v-on="listeners">
            <slot name="columns">
                <el-table-column
                        v-for="column in columnData"
                        :key="column.prop"
                        v-bind="column"
                        :column-key="column.prop"
                        :min-width="column.minWidth || '150px'"
                        :fixed="column.fixed || false"
                        :type="column.type">
                    <template slot="header">
                        <span class="flex items-center" @mouseover="hoverOverHeader(column)" @mouseleave="hoverOverHeader(column)">
                            {{column.label}}
                        </span>
                        <span class="justify-end w-3/6 header-handle">
                            <more-vertical-icon class="flex align-center w-4 h-4 -mx-1"></more-vertical-icon>
                            <more-vertical-icon class="flex align-center w-4 h-4 -mx-2"></more-vertical-icon>
                        </span>
                    </template>
                    <template slot-scope="{row, $index}">
                        <slot :name="column.prop || column.type || column.label"
                              :row="row"
                              :index="$index">
                            {{row[column.prop]}}
                        </slot>
                    </template>
                </el-table-column>
            </slot>
        </el-table>
    </div>
</template>

<script>
    import {Table, TableColumn, Select, Option} from 'element-ui';
    import cloneDeep from 'lodash/cloneDeep'
    import Sortable from 'sortablejs';
    import {MoreVerticalIcon} from 'vue-feather-icons'
    export default {
        name: "data-table",
        data(){
            return{
                columnList: cloneDeep(this.columns),
                optionColumns: cloneDeep(this.columns),
                tableKey: 'table-key',
                active: false
            }
        },
        components:{
            MoreVerticalIcon,
            [Select.name]: Select,
            [Option.name]: Option,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            columns: {
                type: Array,
                default: () => []
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        computed:{
            listeners() {
                return {
                    ...this.$listeners
                }
            },
            columnData (){
                return this.columnList
            },
            tableData(){
                return this.columnList.length > 0 ? this.data : []
            }
        },
        methods: {
            hoverOverHeader(column){
                this.$set(column, 'edit', !column.edit)
            },
            tryInitSortable () {
                const table = this.$el.querySelector('.el-table__header-wrapper thead tr')
                const self = this
                Sortable.create(table, {
                    onEnd ({ newIndex, oldIndex }) {
                        const targetRow = self.columnList.splice(oldIndex, 1)[0]
                        self.columnList.splice(newIndex, 0, targetRow)
                        self.tableKey = self.columnList.map(c => c.prop).join('_')
                        self.$nextTick(self.tryInitSortable)
                    }
                })
            }
        },
        watch:{
            columns(value){
                this.columnList = cloneDeep(value);
                this.optionColumns = cloneDeep(value)
            }
        },
        mounted() {
            this.tryInitSortable()
        }
    }
</script>

<style lang="scss">
    .el-table th .header-handle {
        display: none;
    }
    .el-table th:hover {
        @apply bg-gray-100;
        @apply cursor-pointer
    }
    .el-table th:hover .header-handle {
        display: flex;
    }
    .el-table th>.cell{
        @apply flex;
        @apply items-center;
    }

</style>
