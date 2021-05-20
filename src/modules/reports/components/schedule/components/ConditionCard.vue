<template>
    <div class="shadow-base h-20 rounded-lg w-full flex lg:flex-row justify-between items-center"
         :class="$rtl.isRTL ? 'pr-8' : 'pl-8'">
        <div class="flex w-1/4">
            <base-select class="w-full"
                         :multiple="false"
                         :placeholder="$t('Select Widget')"
                         :data="parameterOptions"
                         v-model="model.parameter"
                         id="parameter"
            />
        </div>
        <div class="flex w-1/4 lg:mx-6">
            <base-select class="w-full"
                         :multiple="false"
                         :placeholder="$t('Widget Column')"
                         :data="parameterOptions"
                         v-model="model.parameter"
                         id="parameter"
            />
        </div>
        <div class="flex w-1/4"
             :class="$rtl.isRTL ? 'ml-6' : 'mr-6'">
            <base-select class="w-full"
                         :multiple="false"
                         :placeholder="$t('Select Aggregation')"
                         :data="operatorOptions"
                         v-model="model.operator"
                         id="operator"
            />
        </div>
        <div class="flex w-1/4">
            <el-input v-model="model.value"
                      :placeholder="$t('Value')"
                      type="number"
                      id="value"
            />
        </div>
        <div class="mx-4">
            <slot name="delete-button"/>
        </div>
    </div>
</template>
<script>
    
    export default {
        data() {
            return {
                model: {
                    parameter: '',
                    operator: '',
                    value: '',
                },
                parameterOptions: [
                    {
                        label: 'First',
                        value: 'first',
                    },
                    {
                        label: 'Second',
                        value: 'second',
                    },
                ],
                operatorOptions: [
                    {
                        label: this.$t('Equality'),
                        value: '=',
                    },
                    {
                        label: this.$t('Greater'),
                        value: '>',
                    },
                    {
                        label: this.$t('Smaller'),
                        value: '<',
                    },
                ],
            }
        },
        methods: {
            onDeleteCondition() {
                this.$emit('on-delete-condition')
            },
        },
    }
</script>
