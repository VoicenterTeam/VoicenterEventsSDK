<template>
    <div class="flex">
        <button class="btn flex items-center p-2 shadow rounded bg-white cursor-pointer text-primary hover:bg-primary-100">
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
