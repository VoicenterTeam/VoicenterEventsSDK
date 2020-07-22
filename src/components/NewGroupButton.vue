<template>
    <div class="flex mx-1">
        <button
            class="btn flex items-center p-2 shadow rounded bg-white cursor-pointer text-primary hover:bg-primary-100">
            <IconPlus class="w-3 fill-current mx-1"/>
            <span class="text-main-xs font-semibold">{{$t('common.newGroup')}}</span>
        </button>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
    }
</script>
