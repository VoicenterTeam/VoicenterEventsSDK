<template>
    <modal v-bind="$attrs"
           :width="modalWidth"
           v-on="$listeners">
        <template v-slot:title>
            <h3 class="text-main-2xl font-semibold text-gray-700">
                {{ $t('tooltip.reorder.dashboard.layout') }}
            </h3>
        </template>
        <div class="py-4">
            <DraggableList
                v-if="showDraggableList"
                :value="widgetGroups"
                @change="(ev) => onGroupListChange(ev)"
                group="widgets">
                <div :key="index"
                     class="w-full flex justify-between items-center items my-1"
                     v-for="(widgetGroup, index) in widgetGroups">
                    <div :style="getStyles" class="widget-item p-1">
                        {{ widgetGroup.WidgetGroupTitle || `# ${widgetGroup.WidgetGroupID}` }}
                    </div>
                    <div class="flex cursor-pointer">
                        <IconDragAndDrop class="text-gray-500 hover:text-primary"/>
                    </div>
                </div>
            </DraggableList>
        </div>
        <template slot="footer">
            <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                <base-button class="mx-4"
                             outline
                             fixed-width="w-37"
                             @click="$emit('on-cancel')">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                        {{ $t('general.discard') }}
                    </span>
                    </div>
                </base-button>
                <base-button fixed-width="w-37"
                             type="primary"
                             @click="onSubmit()">
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                        {{ $t('common.save') }}
                    </span>
                    </div>
                </base-button>
            </div>
        </template>
    </modal>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    import draggableEvents from '@/enum/draggableEvents'
    import DraggableList from '@/components/Widgets/DraggableList'

    export default {
        components: {
            Modal,
            DraggableList,
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                widgetGroups: [],
                modalWidth: '700px',
                showDraggableList: false
            }
        },
        computed: {
            getStyles() {
                return this.$store.getters['layout/widgetTitleStyles']
            },
        },
        methods: {
            onSubmit() {
                this.updateGroupOrder()
                this.$emit('on-submit', this.widgetGroups)
            },
            updateGroupOrder() {
                this.widgetGroups.forEach((group, index) => {
                    this.$set(group, 'Order', index)
                })
            },
            onGroupListChange(ev) {
                let eventData = ev[draggableEvents.MOVED]
                let { newIndex: newIndex, oldIndex: oldIndex } = eventData

                this.widgetGroups.splice(newIndex, 0, this.widgetGroups.splice(oldIndex, 1)[0])

                this.$emit('reorder-widgets-in-modal')
            },
        },
        watch: {
            widgetGroupList: {
                deep: true,
                immediate: true,
                handler(value) {
                    this.widgetGroups = value
                },
            },
        },
        mounted () {
            this.$nextTick(() => {
                this.showDraggableList = true
            })
        }
    }
</script>
<style lang="scss" scoped>
.items {
    @apply flex w-full p-2 shadow-base border;
    border-radius: 4px;
}
</style>
