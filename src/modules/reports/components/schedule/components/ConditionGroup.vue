<template>
    <div class="flex flex-col">
        <div class="flex w-full items-center justify-between">
            <div class="font-bold">
                {{ $t('report.conditionGroup') }}
            </div>
            <div class="flex items-center font-semibold">
                <div class="text-primary-300 flex text-sm items-center hover:text-primary cursor-pointer mx-2"
                     @click="onAddCondition">
                    + {{ $t('general.add') }}
                </div>
                <div v-if="canDelete"
                     class="flex items-center text-red-300 cursor-pointer hover:text-red"
                     @click="onDeleteGroup">
                    <i>
                        <IconClose class="w-2 h-2"/>
                    </i>
                    <span class="text-sm"
                          :class="$rtl.isRTL ? 'ml-auto mr-1': 'mr-auto ml-1'">
                        {{ $t('general.remove') }}
                    </span>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center"
                 v-if="showGroupedIndicator">
                <div class="flex flex-col accolade-height mx-6">
                    <div class="w-1 h-px w-5 bg-gray-550"></div>
                    <div class="flex h-full w-px bg-gray-550 justify-center items-center whitespace-nowrap">
                        <span class="uppercase bg-white whitespace-nowrap">{{ $t('general.and') }}</span>
                    </div>
                    <div class="w-1 h-px w-5 bg-gray-550"></div>
                </div>
            </div>
            <div class="flex flex-col w-full">
                <ConditionCard
                    v-for="(condition, index) in conditions"
                    :key="`condition-${index}`"
                    :index="condition"
                    class="my-2"
                    :condition="condition"
                    :reportItemData="reportItemData"
                    ref="conditionCard"
                >
                    <template v-if="showGroupedIndicator"
                              v-slot:delete-button>
                        <i class="mx-2 text-gray-550 hover:text-red cursor-pointer"
                           @click="onDeleteCondition(index)">
                            <IconClose class="w-3 h-3"/>
                        </i>
                    </template>
                </ConditionCard>
            </div>
        </div>
        <div class="h-px relative bg-gray-550 ml-6 my-6 font-semibold" v-if="amountOfReportDataLength - 1 !== index">
            <div class="absolute uppercase bg-white -mt-4-5 ml-20 p-2">
                {{ $t('general.or') }}
            </div>
            <slot name="new-criteria"/>
        </div>
    </div>
</template>
<script>
    import ConditionCard from '@/modules/reports/components/schedule/components/ConditionCard'

    export default {
        inheritAttrs: false,
        components: {
            ConditionCard,
        },
        props: {
            conditions: {
                type: Array,
                default: () => [],
            },
            canDelete: Boolean,
            reportItemData: {
                type: Object,
                default: () => ({})
            },
            index: {
                type: Number,
                default: null
            },
            amountOfReportDataLength: {
                type: Number,
                default: null
            },
        },
        computed: {
            showGroupedIndicator() {
                console.log(this.conditions.length > 1, this.conditions, 'qwf')
                return this.conditions.length > 1
            },
        },
        methods: {
            onAddCondition() {
                this.$emit('on-add-condition')
            },
            onDeleteCondition(index) {
                this.$emit('on-delete-condition', this.index, index)
            },
            onDeleteGroup() {
                this.$emit('on-delete-group', this.index)
            }
        },
    }
</script>
<style lang="scss">
.accolade-height {
    height: calc(100% - 6rem);
}
.whitespace-nowrap {
    white-space: nowrap !important;
}
</style>
