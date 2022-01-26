<template>
    <modal :append-to-body="true"
           v-bind="$attrs"
           v-on="$listeners"
           :width="modalWidth">
        <template v-slot:title>
            <slot name="title">
                <h3 class="text-2xl font-semibold text-gray-700">
                    {{ $t(title) || $t('general.deleteConfirmation') }}
                </h3>
            </slot>
        </template>
        <slot>
            <template>
                <div class="mt-10 mb-8 flex flex-col items-center justify-center">
                    <IconQuestion/>
                    <div class="text-center text-gray-900 text-sm leading-21 mt-5 max-w-65-p break-normal">
                        {{ $t(description) }}
                    </div>
                </div>
            </template>
        </slot>
        <template v-slot:footer>
            <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                <slot name="footer-actions">
                    <base-button @click="onCancel"
                                 variant="discard"
                                 fixed-width="w-37">
                        <div class="flex items-center">
                            <IconDiscard class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ 'common.cancel' }}</span>
                        </div>
                    </base-button>
                    <base-button fixed-width="w-37"
                                 variant="danger"
                                 @click="onConfirm">
                        <div class="flex items-center">
                            <IconDelete class="mx-1"/>
                            <span class="mx-1 text-base font-bold">{{ 'Delete' }}</span>
                        </div>
                    </base-button>
                </slot>
            </div>
        </template>
    </modal>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    
    export default {
        components: {
            Modal,
        },
        props: {
            title: String,
            modalWidth: {
                type: String,
                default: '445px',
            },
            description: {
                type: String,
                default: 'Are you sure that you want to delete this Dashboard?',
            },
            showButtons: {
                type: Boolean,
                default: true,
            }
        },
        methods: {
            onConfirm() {
                this.$emit('on-confirm')
            },
            onCancel() {
                this.$emit('on-cancel')
            },
        },
    }
</script>
