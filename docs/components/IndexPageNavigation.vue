<template>
    <div class="relative index-navigation-item rounded-xl group">
        <div class="gradient-border" />
        <NuxtLink
            :to="linkData.link"
            class="index-navigation-item__content rounded-xl border-2 border-transparent py-6 px-5 flex bg-white dark:bg-gray-900 hover:bg-gradient-to-l to-white/1 from-primary/5"
        >
            <div v-if="linkData.icon">
                <UIcon
                    :name="linkData.icon"
                    size="32"
                    class="text-primary-400"
                />
            </div>
            <div>
                <h2 class="font-semibold text-xl mb-2">
                    {{ linkData.label }}
                </h2>
                <p class="text-gray-700 dark:text-gray-300">
                    {{ linkData.info }}
                </p>
            </div>
            <UIcon
                name="i-solar:arrow-right-up-outline"
                class="absolute right-2 top-2 dark:text-white/40 text-[#020420]/20 group-hover:text-primary group-hover:size-5 transition-all"
                size="1rem"
            />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
interface ILinkData {
    label: string
    link: string
    info?: string
    icon?: string
}
defineProps<{
    linkData: ILinkData
}>()
</script>

<style lang="scss">
    .index-navigation-item {
        @apply lg:min-h-min sm:min-h-[220px] md:min-h-[180px] border-transparent border min-h-min rounded-xl border-gray-200 dark:border-transparent hover:border-transparent;
        .gradient-border {
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            border-radius: 12px;
            transform: translate(-1px, -1px);
        }
        .index-navigation-item__content {
            @apply relative py-6 px-5 rounded-xl flex flex-col gap-x-4 dark:border-none bg-white dark:bg-gray-900 sm:min-h-[220px] md:min-h-[180px] lg:min-h-min;
        }
        &:hover {
            .gradient-border {
                opacity: 1;
                transition: all 0.3s linear;
                background: linear-gradient(var(--gradient-angle), rgb(226, 21, 21), rgb(159, 7, 7), rgba(255, 255, 255, 0.3), rgb(158, 9, 9));
                animation: gradient-rotate 5s cubic-bezier(0,0,1,1) 0s infinite reverse;
            }
        }

    }
    .light {
        .index-navigation-item {
            &:hover {
                .gradient-border {
                    background: linear-gradient(var(--gradient-angle), rgb(237, 92, 78), rgb(223, 86, 73), rgba(207, 205, 205, 0.42), rgb(216, 107, 96));
                }
            }
        }
    }

@property --gradient-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 180deg
}

@keyframes gradient-rotate {
    0% {
        --gradient-angle: 0deg
    }

    100% {
        --gradient-angle: 360deg
    }
}

</style>
