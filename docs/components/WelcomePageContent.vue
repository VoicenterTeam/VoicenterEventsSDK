<template>
    <div class="py-10 sm:py-16 md:py-20 relative h-full flex items-center justify-center">
        <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div class="py-5 lg:py-10 text-center">
                <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                    <span>Voicenter Events <span class="text-primary-400">SDK</span>
                    </span>
                </h1>
                <div class="py-5 tracking-tight dark:text-gray-300 mt-6 text-lg/8 lg:px-28 text-gray-400">
                    Voicenter Events SDK aims to manage API and socket communication with Voicenter APIs and backends. You can use the SDK to send and receive real-time data from and to voicenter servers.
                </div>
            </div>
            <div class="p-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
                    <IndexPageNavigation
                        v-for="nav in navigationLinks"
                        :key="nav.label"
                        :link-data="nav"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import IndexPageNavigation from '~/components/IndexPageNavigation.vue'

const navigationLinks = [
    {
        label: 'Documentation',
        info: 'We highly recommend you take a look at the Nuxt documentation to level up.',
        icon: 'i-solar:notebook-bookmark-line-duotone',
        link: '/docs'
    },
    {
        label: 'API',
        info: 'We highly recommend you take a look at the Nuxt documentation to level up.',
        icon: 'i-solar:server-minimalistic-broken',
        link: '/api-docs'
    },
    {
        label: 'Example',
        info: 'We highly recommend you take a look at the Nuxt documentation to level up.',
        icon: 'i-solar:programming-outline',
        link: '/example'
    }
]
</script>

<style>

</style>
