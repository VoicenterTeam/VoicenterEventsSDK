<template>
    <div class="h-full">
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
                    type="primary"
                    @click="goNext"
                >
                    <div class="flex items-center">
                        <span class="mx-1 text-base font-bold">
                            {{ $t('general.next') }}
                        </span>
                        <IconDirRight class="mx-1" />
                    </div>
                </base-button>
            </div>
        </portal>
    </div>
</template>

<script>
export default {
    methods: {
        goNext () {
            this.$emit('on-update-step-number', { nextStep: true })
        },
        onBack () {
            this.$emit('on-back')
        }
    }
}
</script>