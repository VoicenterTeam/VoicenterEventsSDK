<template>
    <div class="flex flex-wrap relative w-full bg-white mobile-wizard">
        <div class="flex flex-wrap">
            <div class="flex justify-between items-center w-full px-6 pt-6">
                <div class="text-lg font-bold text-default-text">
                    {{$t('general.addEntity',{ entity: entityName } ) }}
                </div>
                <i class="vc-close icon-base text-field-borders" @click="onCancel"/>
            </div>

            <div class="steps-wrapper w-full content-height pt-6">
                <slot></slot>
            </div>

            <div class="w-full navigation">
                <div class="xxl:mx-24 xxl:my-10 my-5 mx-5">
                    <div class="flex justify-between -mx-2">
                        <cancel-button @click="onCancel"
                                       class="mx-2"
                                       outline/>

                        <base-button v-if="!onLastStep"
                                     @click="onNext"
                                     type="primary">
                            {{ $t('generic.next') }}
                            <i class="vc-next icon-base ml-2 text-white"/>
                        </base-button>
                        <base-button v-if="onLastStep"
                                     @click.once="onFinish"
                                     type="primary">
                            {{ $t('generic.finish') }}
                        </base-button>
                    </div>
                    <base-checkbox v-if="onLastStep"
                                   class="text-center mt-4 text-xs font-normal"
                                   v-model="createAnotherData">
                        {{ $t('general.message.form.createAnotherEntity', {entity: entityName}) }}
                    </base-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {wizardMixin} from "@/mixins/wizardMixin";
    import CancelButton from 'src/components/CancelButton';

    export default {
        name: 'mobile-wizard',
        mixins: [wizardMixin],
        components: {
            CancelButton,
        }
    }
</script>

<style lang="scss" scoped>
    .mobile-wizard {
        margin: 5px 0 0px;
        box-shadow: 0px -5px 7px rgba(38, 49, 72, 0.25);
        border-radius: 30px 30px 0px 0px;
    }
    .content-height{
        min-height: calc(100vh - 95px - 54px - 68px);
    }

    .steps-wrapper {
        overflow: hidden;
    }


    .navigation {
        @apply border-t-2 border-field-borders;
    }

    .actions-create-checkbox {
        @apply ml-6;
    }

    .rtl {
        .actions-create-checkbox {
            @apply ml-0 mr-6;
        }
    }
</style>
