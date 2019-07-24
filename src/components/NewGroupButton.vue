<template>
    <div class="flex">
        <button class="btn flex items-center p-4 text-blue shadow rounded bg-white hover:bg-blue-100 cursor-pointer text-primary">
            <IconPlus class="w-3 fill-current mx-1"></IconPlus>
            <span class="text-xs">{{$t('common.newGroup')}}</span>
        </button>
    </div>
</template>

<script>
    export default {
        name: "new-group-button"
    }
</script>

<style scoped>

</style>
