<template>
    <div class="flex">
        <ArrowDownIcon class="flex align-center w-6 h-6 mx-1 text-primary cursor-pointer"
                       @click="$emit('move-down')">
        </ArrowDownIcon>
        <ArrowUpIcon class="flex align-center w-6 h-6 mx-2 text-primary cursor-pointer"
                     @click="$emit('move-up')">
        </ArrowUpIcon>
        <Trash2Icon class="flex align-center w-6 h-6 mx-1 text-red cursor-pointer"
                    @click="$emit('remove-group')"
        ></Trash2Icon>
    </div>

</template>

<script>
    import { ArrowUpIcon, ArrowDownIcon, Trash2Icon } from 'vue-feather-icons'
    export default {
        name: "edit-group-buttons",
        components: {
            ArrowUpIcon,
            ArrowDownIcon,
            Trash2Icon
        }
    }
</script>

<style scoped>

</style>
