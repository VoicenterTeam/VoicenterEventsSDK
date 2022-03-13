<template>
    <div class="h-full">
        <div>
            <schedule-list />
        </div>
        <portal to="prev-button">
            <base-button
                outline
                fixed-width="w-37"
                @click="onBack"
            >
                <div class="flex items-center">
                    <IconDirLeft class="mx-1"/>
                    <span class="mx-1 text-base font-bold">{{ $t('general.back') }}</span>
                </div>
            </base-button>
        </portal>
        <portal to="next-button">
            <div class="flex">
                <base-button
                    fixed-width="w-37"
                    size="md"
                    type="primary"
                    @click="onFinish"
                >
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                            {{ $t('general.finish') }}
                        </span>
                    </div>
                </base-button>
            </div>
        </portal>
    </div>
</template>

<script>
export default {
    components: {
        ScheduleList: () => import('@/modules/reports/components/ScheduleList.vue')
    },
    methods: {
        goNext () {
            this.$emit('on-update-step-number', { nextStep: true })
        },
        onFinish () {
            console.log('on finish')
        },
        onBack () {
            this.$emit('on-back')
        }
    }
}
</script>