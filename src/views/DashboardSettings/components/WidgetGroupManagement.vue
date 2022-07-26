<template>
    <div>
        <div class="flex items-center pb-6 border-b border-gray-300">
            <IconWidgetGroup class="text-primary"/>
            <span class="mx-1 text-xl font-bold text-gray-900">
                {{ $t('widget.widgetGroupManagement') }}
            </span>
        </div>
        <DraggableList
            :value="widgetGroups"
            @change="(ev) => onGroupListChange(ev)"
            group="widgets"
            class="cursor-pointer"
        >
            <div
                :key="widgetGroup.WidgetGroupID"
                class="flex w-full items-center py-6 border-b border-gray-300 md:px-2"
                v-for="widgetGroup in widgetGroups"
            >
                <div class="flex items-center justify-between w-full hover:text-primary">
                    <div class="flex items-center">
                        <IconMoveUp class="text-gray-500"/>
                        <IconMoveDown class="text-gray-500"/>
                        <span class="mx-2">
                            {{ widgetGroup.WidgetGroupTitle || `# ${widgetGroup.WidgetGroupID}` }}
                        </span>
                    </div>
                    <!-- <div class="flex items-center cursor-pointer text-primary">
                        <span class="mr-2 font-bold">Edit</span>
                        <IconShape/>
                    </div> -->
                    <!--TODO: need to add functionality -->
                </div>
            </div>
        </DraggableList>
    </div>
</template>
<script>
    import draggableEvents from '@/enum/draggableEvents'
    import { WidgetGroupsApi } from '@/api/widgetGroupApi'
    import notification from '@/mixins/simpleNotification'

    export default {
        components: {
            DraggableList: () => import('@/components/Widgets/DraggableList'),
        },
        props: {
            widgetGroupList: {
                type: Array,
                default: () => ([]),
            },
        },
        data() {
            return {
                widgetGroups: [],
            }
        },
        methods: {
            onGroupListChange(ev) {
                let eventData = ev[draggableEvents.MOVED]
                let { newIndex: newIndex, oldIndex: oldIndex } = eventData
                this.widgetGroups.splice(newIndex, 0, this.widgetGroups.splice(oldIndex, 1)[0])
                this.$nextTick(() => {
                    this.updateGroupOrder()
                })
            },
            updateGroupOrder() {
                this.widgetGroups.forEach((group, index) => {
                    this.$set(group, 'Order', index)
                })

                this.$emit('on-update-groups', this.widgetGroups)

                WidgetGroupsApi.reorder(this.widgetGroups)
                notification.call({
                    type: 'success',
                    message: this.$t('common.changesSaved')
                })
            }
        },
        watch: {
            widgetGroupList: {
                deep: true,
                immediate: true,
                handler(groups) {
                    this.widgetGroups = groups
                },
            },
        },
    }
</script>
