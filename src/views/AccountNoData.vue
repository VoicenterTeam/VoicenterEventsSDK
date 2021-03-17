<template>
    <div class="min-h-screen flex">
        <div class="w-full flex flex-col items-center justify-center"
             key="no-data">
            <IconNoData class="h-56 w-56 text-gray-500"/>
            <p class="text-gray-500 max-w-lg text-center">
                {{ $t('Account no data') }}
            </p>
            <span
                @click="createNewDashboard()"
                class="hover:bg-primary-100 hover:text-primary hover:border-primary py-1 mt-2 px-4 cursor-pointer text-gray-500 flex items-center border-2 rounded">
                    <IconPlus class="w-3 mr-1 mb-0-5"/>
                    <span>{{ $t('common.newDashboard') }}</span>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            createNewDashboard() {
                this.$router.push('dashboard-creation')
            },
        },
    }
</script>
