<template>
    <div class="bg-white p-10 rounded-lg">
        <div class="flex justify-end">
            <div class="my-4">
                <el-select
                        v-model="columnList"
                        value-key="prop"
                        multiple
                        filterable
                        default-first-option
                        placeholder="Choose tags for your article">
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
                  :data="tableData"
                  v-bind="$attrs"
                  v-on="listeners">
            <slot name="columns">
                <el-table-column
                        v-for="column in columnData"
                        :key="column.prop"
                        v-bind="column"
                        :min-width="column.minWidth || '150px'"
                        :fixed="column.fixed || false"
                        :type="column.type">
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
    export default {
        name: "data-table",
        data(){
            return{
                columnList: cloneDeep(this.columns),
                optionColumns: cloneDeep(this.columns)
            }
        },
        components:{
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
        }
    }
</script>

<style scoped>

</style>