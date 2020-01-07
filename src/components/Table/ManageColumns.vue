<template>
    <div>
        <div class="flex items-center manage-columns-header">{{$t('datatable.manage.columns.header')}}</div>
        <div class="flex flex-col sm:flex-row">
            <manage-columns-section
                :availableColumns="activeColumns"
                @onChange="(evt) => onColumnChange(evt , sectionsToManage.TO_HIDE)">
                <template v-slot:button="{columns, allChecked}">
                    <div :class="getClass">
                        <el-button :disabled="!activeColumns.length" class="w-24" type="danger" size="small"
                                   @click="removeColumns(columns)">
                            {{allChecked ? $t('datatable.manage.columns.remove.all') :
                            $t('datatable.manage.columns.remove')}}
                        </el-button>
                    </div>
                </template>
            </manage-columns-section>
            <manage-columns-section
                :availableColumns="showAvailableColumns"
                @onChange="(evt) => onColumnChange(evt , sectionsToManage.TO_SHOW)">
                <template v-slot:search>
                    <div class="w-4/6 mx-2">
                        <el-input :placeholder="$t('datatable.manage.columns.search')"
                                  v-model="filter"
                                  suffix-icon="el-icon-search" class="search-columns"/>
                    </div>
                </template>
                <template v-slot:button="{columns, allChecked}">
                    <el-button :disabled="!showAvailableColumns.length" class="w-24" type="success" size="small"
                               @click="addColumns(columns)">
                        {{allChecked ? $t('datatable.manage.columns.add.all') : $t('datatable.manage.columns.add')}}
                    </el-button>
                </template>
            </manage-columns-section>
        </div>
    </div>
</template>
<script>
    import xor from 'lodash/xor'
    import get from 'lodash/get'
    import {sectionsToManage} from '@/enum/dataTable'
    import draggableEvents from '@/enum/draggableEvents'
    import ManageColumnsSection from './ManageColumnsSection'

    export default {
        components: {
            ManageColumnsSection,
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
                filteredColumns: [],
                isIndeterminate: false,
                sectionsToManage,
            }
        },
        computed: {
            showAvailableColumns() {
                return this.filter ? this.filteredColumns : this.unselectedColumns
            },
            getClass() {
                if (this.activeColumns.length === 0) {
                    if (this.$rtl.isRTL) {
                        return 'mr-auto'
                    } else {
                        return 'ml-auto'
                    }
                }
                return ''
            }
        },
        methods: {
            addColumns(columns) {
                let itemToRemove = this.unselectedColumns.filter(c => columns.includes(c.prop));
                let remainingItems = this.unselectedColumns.filter(c => !columns.includes(c.prop));
                this.activeColumns = this.activeColumns.concat([...itemToRemove]);
                this.unselectedColumns = remainingItems;

                this.valueToRemove = this.activeColumns.map(c => c.prop);
                this.valueToAdd = [];

                let newColumns = this.activeColumns.map(c => c.prop);
                this.$emit('on-change-visibility', newColumns)
            },
            removeColumns(columns) {
                let itemToRemove = this.activeColumns.filter(c => columns.includes(c.prop));
                let remainingItems = this.activeColumns.filter(c => !columns.includes(c.prop));
                this.unselectedColumns = this.unselectedColumns.concat([...itemToRemove]);
                this.activeColumns = remainingItems;

                this.valueToRemove = this.activeColumns.map(c => c.prop);

                let newColumns = this.activeColumns.map(c => c.prop);
                this.$emit('on-change-visibility', newColumns)
            },
            // on list change
            onColumnChange(evt, section) {
                let action = get(Object.keys(evt), 0)
                let eventData = evt[action]
                let column = get(eventData, 'element')

                if (action === draggableEvents.MOVED && section === sectionsToManage.TO_HIDE) {
                    this.$emit('on-reorder-column', eventData)
                } else {
                    this[section]([column])
                }
            },
            initData() {
                this.activeColumns = this.availableColumns.filter(c => this.visibleColumns.includes(c.prop));
                this.unselectedColumns = xor(this.availableColumns, this.activeColumns)
                this.allColumnsValue = this.activeColumns.map(c => c.prop);
                this.valueToRemove = this.allColumnsValue;
            },
            handleCheckAllChange(checked, section) {
                this[section] = checked ? this.allColumnsValue : [];
                this.isIndeterminate = false;
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
            visibleColumns: {
                immediate: true,
                handler: function () {
                    this.initData()
                }
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
        color: var(--greyish-brown);
    }
</style>
