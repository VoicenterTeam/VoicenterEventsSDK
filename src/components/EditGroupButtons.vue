<template>
    <div class="flex">
        <ArrowDownIcon class="flex align-center w-6 h-6 mx-1 text-primary cursor-pointer"
                       @click="orderWidgetGroup('down')">
        </ArrowDownIcon>
        <ArrowUpIcon class="flex align-center w-6 h-6 mx-2 text-primary cursor-pointer"
                     @click="orderWidgetGroup('up')">
        </ArrowUpIcon>
        <Trash2Icon class="flex align-center w-6 h-6 mx-1 text-red cursor-pointer"
                    @click="$emit('remove-group', widgetGroup)"
        ></Trash2Icon>
    </div>
</template>

<script>
    import {ArrowUpIcon, ArrowDownIcon, Trash2Icon} from 'vue-feather-icons'

    export default {
        name: "edit-group-buttons",
        components: {
            ArrowUpIcon,
            ArrowDownIcon,
            Trash2Icon
        },
        props: {
            widgetGroup: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            orderWidgetGroup(direction) {
                this.$emit('order-groups', {'widgetGroup': this.widgetGroup, 'direction': direction})
            }
        }
    }
</script>

<style scoped>

</style>
