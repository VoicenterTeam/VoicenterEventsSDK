<template>
    <div class="relative bg-gray-50 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div class="relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
                <div class="text-center">
                    <h2 class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                        {{ $t('Houston') }},
                        <br class="xl:hidden"/>
                        <span class="text-primary-600">
                            {{ $t('we have a problem') }}
                        </span>
                    </h2>
                    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        {{ $t(`We couldn't find the page you are looking for`) }}
                    </p>
                    <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <base-button class="sm:mr-5"
                                     variant="white"
                                     size="xl"
                                     @click="$router.go(-1)">
                            {{ $t('Go back') }}
                        </base-button>
                        <base-button variant="primary"
                                     size="xl"
                                     @click="$router.push('/')">
                            {{ $t('Take me Home') }}
                        </base-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {}
</script>
<style>
</style>
