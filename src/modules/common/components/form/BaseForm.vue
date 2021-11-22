<template>
    <div class="md:grid md:grid-cols-3 md:gap-6"
         :class="{[`layout-${layout}`]: layout}"
    >
        <slot name="info">
            <div class="md:col-span-1 form-description">
                <div class="px-4 sm:px-0">
                    <h3 v-if="title || $slots.title" class="text-lg font-medium leading-6 text-gray-900">
                        <slot name="title">
                            {{ title }}
                        </slot>
                    </h3>
                    <p v-if="description || $slots.description" class="mt-1 text-sm leading-5 text-gray-600">
                        <slot name="description">
                            {{ description }}
                        </slot>
                    </p>
                </div>
            </div>
        </slot>
        <div class="mt-5 md:mt-0 md:col-span-2 form-info">
            <ValidationObserver v-slot="{ handleSubmit, valid }" ref="observer">
                <form @submit.prevent="handleSubmit(onSubmit)">
                    <slot name="header" :valid="valid" :handleSubmit="handleSubmit"/>
                    <div :class="wrapperClasses">
                        <div :class="gridClasses">
                            <slot :handleSubmit="handleSubmit"></slot>
                        </div>
                    </div>
                    <slot name="footer" :valid="valid" :handleSubmit="handleSubmit"/>
                </form>
            </ValidationObserver>
            <slot name="additional-section"/>
        </div>
    </div>
</template>
<script>
    
    export default {
        props: {
            loading: Boolean,
            title: String,
            description: String,
            cancelText: {
                type: String,
                default: 'Cancel',
            },
            saveText: {
                type: String,
                default: '',
            },
            layout: {
                type: String,
                default: 'default',
            },
            showButtons: {
                type: Boolean,
                default: true,
            },
            canSubmitForm: {
                type: Boolean,
                default: true,
            },
            showBack: {
                type: Boolean,
                default: false,
            },
            showCancel: {
                type: Boolean,
                default: false,
            },
            footerBackground: {
                type: Boolean,
                default: true,
            },
            fixedFooter: {
                type: Boolean,
                default: false,
            },
            gridClasses: {
                type: String,
                default: 'grid grid-cols-3 gap-x-3',
            },
            wrapperClasses: {
                type: String,
                default: 'border rounded-md p-10 shadow-base bg-white w-full rounded-tl-none',
            },
            submitDisabled: {
                type: Boolean,
                default: false,
            },
            canCreateAnotherEntity: {
                type: Boolean,
                default: false,
            },
        },
        methods: {
            onSubmit(evt) {
                this.$emit('submit', evt)
            },
            validate() {
                return this.$refs.observer.validate()
            },
        },
    }
</script>
<style lang="scss" scoped>
//.layout-modal {
//    .form-description {
//        @apply hidden;
//    }
//
//    .form-info {
//        @apply col-span-3;
//    }
//
//    .form__inner {
//        @apply shadow-none;
//    }
//
//    .form-footer {
//        @apply bg-transparent;
//    }
//}

.layout-vertical {
    .form-info,
    .form-description {
        @apply col-span-3;
    }
}
</style>
