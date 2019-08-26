<template>
    <div>
        <div class="flex items-center header">{{$t('datatable.manage.columns.header')}}</div>
        <div class="flex">
            <div class="management-section">
                <div class="flex justify-between items-center column-management-section">
                    <p class="items-selected">  {{$t('datatable.manage.columns.items', {item: 0})}} </p>
                    <el-button type="danger" size="small" @click="handleCheckedColumnsChange">
                        {{$t('datatable.manage.columns.remove')}}
                    </el-button>
                </div>
                <div>
                    <el-checkbox-group class="flex flex-col" v-model="valueToRemove">
                        <el-checkbox class="py-2" v-for="column in activeColumns" :label="column.prop"
                                     :key="column.label">{{column.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="management-section">
                <div class="flex justify-between items-center column-management-section">
                    <p class="column-management-text"> o items selected </p>
                    <el-button type="success" size="small">
                        {{$t('datatable.manage.columns.add')}}
                    </el-button>
                </div>
                <div>
                    <el-checkbox-group class="flex flex-col" v-model="valueToAdd">
                        <el-checkbox class="py-2" v-for="column in unselectedColumns" :label="column.prop"
                                     :key="column.label">{{column.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Checkbox, CheckboxGroup} from 'element-ui'
    export default {
        name: "manage-columns",
        components: {
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
                valueToRemove:[],
                valueToAdd:[],
                activeColumns:[],
                unselectedColumns:[],
            }
        },
        computed: {},
        methods: {
            handleCheckAllChange(val) {
                this.checkedColumns = val ? this.visibleColumns : [];
                this.$emit('on-change-visibility', this.checkedColumns)
            },
            handleCheckedColumnsChange() {
                this.$emit('on-change-visibility', this.valueToRemove)
            },
        },
        mounted(){
            this.activeColumns = this.availableColumns.filter(c => this.visibleColumns.includes(c.prop));
            this.unselectedColumns = this.availableColumns.filter(c => !this.visibleColumns.includes(c.prop));

        }
    }
</script>

<style scoped lang="scss">
    .header{
        height: 40px;
        padding: 10px 20px;
        box-shadow: 0 1px 0 0 var(--silver);
        background-color: #f0f2f4;
        font-size: 14px;
        font-weight: normal;
        color: var(--greyish-brown);

    }
    .column-management-section{
        height: 60px;
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
    .management-section{
        height: 300px;
        min-width: 350px;
        padding: 0 20px;

    }
    .management-section + .management-section{
        border-left: solid 1px var(--silver-color);
    }

</style>
