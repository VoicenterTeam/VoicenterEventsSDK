<template>
    <modal v-bind="attrs"
           v-on="$listeners">
        <template v-slot:title>
            <slot name="title">
                <h3 class="title">
                    {{ dialogTitle }}
                </h3>
            </slot>
        </template>
        <slot>
            <template>
                <div class="mt-10 mb-8 flex flex-col items-center justify-center">
                    <component :is="dialogConfig.descriptionIcon"/>
                    <div class="text-center text-gray-900 text-sm leading-21 mt-5 max-w-65-p break-normal">
                        {{ dialogDescription }}
                    </div>
                </div>
            </template>
        </slot>
        <template v-slot:footer>
            <div class="footer">
                <slot name="footer-actions">
                    <cancel-button
                        :icon="dialogConfig.cancelIcon"
                        :label="dialogConfig.cancelText"
                        @on-click="onCancel"
                    />
                    <confirm-button
                        :icon="dialogConfig.confirmIcon"
                        :label="dialogConfig.confirmText"
                        @on-click="onConfirm"
                    />
                </slot>
            </div>
        </template>
    </modal>
</template>

<script>
import dialogMixin from "@/mixins/dialogMixin"

export default {
    name: 'Dialog',
    mixins: [ dialogMixin ],
    components: {
        Modal: () => import('@/components/Common/Modal'),
        CancelButton: () => import("@/components/Common/Buttons/CancelButton"),
        ConfirmButton: () => import("@/components/Common/Buttons/ConfirmButton")
    }
}
</script>

<style lang="scss">
.title {
    @apply text-2xl font-semibold text-gray-700;
}
.footer {
    @apply border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between;
}
</style>
