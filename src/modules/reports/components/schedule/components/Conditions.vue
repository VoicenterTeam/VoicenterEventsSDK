<template>
    <div>
        <div class="w-full flex flex-col content-wrapper_step-1">
            <ConditionGroup v-for="(group, index) in groups"
                            class="flex w-full px-1"
                            :key="index"
                            @on-delete-condition="data => onDeleteCondition(data, index)"
                            @on-add-condition="onAddCondition(index)"
                            @on-delete-group="onDeleteGroup(index)"
                            :can-delete="canDelete"
                            :conditions="group"
            />
        </div>
        <div class="my-6">
            <base-button @click="onNewCriteria"
                         variant="white"
            >
                <span class="font-semibold">
                    {{ $t('New Criteria') }}
                </span>
            </base-button>
        </div>
    </div>
</template>
<script>
    import ConditionGroup from '@/modules/reports/components/schedule/components/ConditionGroup'
    
    export default {
        components: {
            ConditionGroup,
        },
        data() {
            return {
                emptyCondition: {
                    props: {},
                },
                emptyCriteria: [
                    {
                        props: {},
                    },
                ],
                groups: [
                    [
                        {
                            props: {},
                        },
                    ],
                ],
            }
        },
        computed: {
            canDelete() {
                return this.groups.length > 1
            },
        },
        methods: {
            onAddCondition(index) {
                this.groups[index].push(this.emptyCondition)
            },
            onDeleteCondition(data = {}, groupIndex) {
                const { group, index } = data
                group.splice(index, 1)
                this.groups[groupIndex] = group
                if (!group.length) {
                    this.groups.splice(groupIndex, 1)
                }
            },
            onDeleteGroup(index) {
                this.groups.splice(index, 1)
            },
            emitter(event) {
                this.$emit(event)
            },
            onNewCriteria() {
                this.groups.push(this.emptyCriteria)
            },
        },
    }
</script>
<style lang="scss">
.content-wrapper_step-1 {
    max-height: calc(100vh - 500px);
    @apply overflow-auto;
}
</style>
