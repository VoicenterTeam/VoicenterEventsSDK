<template>
    <div>
        <div class="flex items-center manage-columns-header">{{$t('datatable.manage.columns.header')}}</div>
        <div class="flex flex-col sm:flex-row">
            <div class="manage-columns-section">
                <div class="flex justify-between items-center manage-columns-section-header">
                    <p class="items-selected">
                        {{$tc('datatable.manage.columns.items', numberOfSelectedColumns, { item: numberOfSelectedColumns })}}
                    </p>
                    <el-button type="danger" size="small" @click="removeColumns">
                        {{$t('datatable.manage.columns.remove')}}
                    </el-button>
                </div>
                <div class="manage-columns-section-content">
                    <el-checkbox-group class="flex flex-col column-checkbox" v-model="valueToRemove">
                        <el-checkbox class="py-2" v-for="column in activeColumns" :label="column.prop"
                                     :key="column.label">{{column.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="manage-columns-section">
                <div class="flex justify-between items-center manage-columns-section-header">
                    <div class="w-4/6">
                        <el-input :placeholder="$t('datatable.manage.columns.search')"
                                  v-model="filter"
                                  suffix-icon="el-icon-search" class="search-columns"></el-input>
                    </div>

                    <el-button type="success" size="small" @click="addColumns">
                        {{$t('datatable.manage.columns.add')}}
                    </el-button>
                </div>
                <div class="manage-columns-section-content">
                    <el-checkbox-group class="flex flex-col column-checkbox" v-model="valueToAdd">
                        <el-checkbox class="py-2" v-for="column in showAvailableColumns" :label="column.prop"
                                     :key="column.label">{{column.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import xor from 'lodash/xor'
    import {Checkbox, CheckboxGroup, Select, Option} from 'element-ui'

    export default {
        name: "manage-columns",
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
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
        data() {
            return {
                filter: '',
                allColumnsValue: [],
                valueToRemove: [],
                valueToAdd: [],
                activeColumns: [],
                unselectedColumns: [],
                filteredColumns: []
            }
        },
        computed: {
            numberOfSelectedColumns() {
                return this.valueToRemove.length
            },
            showAvailableColumns() {
                return this.filter ? this.filteredColumns : this.unselectedColumns
            }
        },
        methods: {
            addColumns() {
                let itemToRemove = this.unselectedColumns.filter(c => this.valueToAdd.includes(c.prop));
                let remainingItems = this.unselectedColumns.filter(c => !this.valueToAdd.includes(c.prop));
                this.activeColumns = this.activeColumns.concat([...itemToRemove]);
                this.unselectedColumns = remainingItems;

                this.valueToRemove = this.activeColumns.map(c => c.prop);
                this.valueToAdd = [];

                let newColumns = this.activeColumns.map(c => c.prop);
                this.$emit('on-change-visibility', newColumns)
            },
            removeColumns() {
                let itemToRemove = this.activeColumns.filter(c => this.valueToRemove.includes(c.prop));
                let remainingItems = this.activeColumns.filter(c => !this.valueToRemove.includes(c.prop));
                this.unselectedColumns = this.unselectedColumns.concat([...itemToRemove]);
                this.activeColumns = remainingItems;

                this.valueToRemove = this.activeColumns.map(c => c.prop);

                let newColumns = this.activeColumns.map(c => c.prop);
                this.$emit('on-change-visibility', newColumns)
            },
            initData() {
                this.activeColumns = this.availableColumns.filter(c => this.visibleColumns.includes(c.prop));
                this.unselectedColumns = xor(this.availableColumns, this.activeColumns)
                this.allColumnsValue = this.activeColumns.map(c => c.prop);
                this.valueToRemove = this.allColumnsValue;
            }
        },
        watch: {
            filter(value) {
                let filteredData = [];
                this.unselectedColumns.forEach(el => {
                    if (el.label.toLowerCase().includes(value.toLowerCase())) {
                        filteredData.push(el);
                    }
                });
                this.filteredColumns = filteredData
            },
            visibleColumns() {
                this.initData();
            }
        }
    }
</script>

<style scoped lang="scss">
    .manage-columns-header {
        height: 40px;
        padding: 10px 20px;
        box-shadow: 0 1px 0 0 var(--silver);
        background-color: var(--bg-grey-modal);
        font-size: 14px;
        font-weight: normal;
        color: var(--greyish-brown);

    }

    .manage-columns-section-header {
        height: 60px;
        padding: 0 20px;
    }

    .manage-columns-section-content{
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
        font-weight: 300;
        color: #4b4d56;
    }

    .search-columns /deep/ .el-input__suffix .el-input__icon {
        line-height: 32px;
    }

    .column-checkbox /deep/ .el-checkbox {
        margin-right: 0;
        padding: 10px 20px;

        .el-checkbox__input + .el-checkbox__label {
            font-size: 12px;
            font-weight: normal;
        }

        .el-checkbox__input > .el-checkbox__inner {
            height: 18px;
            width: 18px;

            &::after {
                border-width: 2px;
                height: 10px;
                left: 6px;
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
</style>
