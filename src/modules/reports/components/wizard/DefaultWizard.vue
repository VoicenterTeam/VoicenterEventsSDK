<template>
    <div class="wizard-wrapper flex flex-wrap relative w-full bg-white rounded-lg shadow-card"
         :data-test="`wizard-${dataTestName}`"
         :class="{
            'wizard-height-sm': height === 'sm',
            'wizard-height-lg': height === 'lg',
         }">
        <div class="wizard-step flex flex-wrap" :class="{'full-width': !showSummary}" v-loading="dataLoading">
            <div class="w-full xxl:px-24 xxl:pt-10 pt-7 px-14 flex justify-between" v-if="showTopBar">
                <span class="steps-topbar-pagination text-sm">
                    {{ $t('general.step') }} {{ activeIndex + 1 }} {{ $t('general.of') }} {{ steps.length }}
                </span>
            </div>

            <div class="steps-wrapper w-full px-14">
                <slot></slot>
            </div>
            <div class="w-full navigation">
                <div class="xxl:mx-24 xxl:my-10 my-5 mx-14">
                    <div class="flex justify-between">
                        <base-button
                            outline
                            fixed-width="w-37"
                            @click="onCancel"
                            v-if="onFirstStep"
                        >
                            <div class="flex items-center">
                                <IconDiscard class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ $t('common.cancel') }}</span>
                            </div>
                        </base-button>
                        <base-button
                            outline
                            fixed-width="w-37"
                            @click="onPrevious"
                            v-if="!onFirstStep && showPreviousButton"
                        >
                            <div class="flex items-center">
                                <i class="vc-icon-back icon-base mx-1" />
                                <span class="mx-1 text-base font-bold">{{ $t('general.back') }}</span>
                            </div>
                        </base-button>
                        <div class="flex">
                            <slot name="extra-actions"></slot>
                            <base-button
                                v-if="!onLastStep"
                                @click="onNext"
                                data-test-name="wizard-next"
                                :disabled="!nextButtonCheck"
                                type="primary"
                            >
                                {{ $t('general.next') }}
                                <i class="vc-icon-next icon-base ml-2"/>
                            </base-button>
                            <base-button
                                v-if="onLastStep"
                                @click="onFinish"
                                :loading="dataLoading"
                                data-test-name="wizard-finish"
                                :disabled="true"
                                type="primary"
                            >
                                <!-- TODO: need to change :disabled="disableFinishButton" -->
                                <IconSave class="mx-1"/>
                                {{ $t('general.finish') }}
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="bg-gray-100 wizard-summary"
            v-if="showSummary"
        >
            <wizard-summary
                :active="activeIndex"
                ref="summary"
                :model="model"
                :steps="steps"
            >

                <slot-renderer v-for="(step, index) in steps" :key="index" :step="step"/>

            </wizard-summary>
        </div>
    </div>
</template>

<script>
    import {wizardMixin} from '@/mixins/wizardMixin';
    import WizardSummary from './WizardSummary';
    import WizardSummaryStep from './WizardSummaryStep';

    export default {
        name: 'default-wizard',
        props: {
            name: {
                type: String,
                default: ''
            },
            dataTestName: {
                type: String,
                default: ''
            }
        },
        mixins: [wizardMixin],
        components: {
            WizardSummary,
            slotRenderer: {
                props: ['step'],
                components: {
                    WizardSummaryStep
                },
                render(h) {
                    return h('wizard-summary-step', [
                        h('template', {slot: 'header'}, [this.step.$slots.header]),
                        h('template', {slot: 'summary'}, [this.step.$slots.summary])
                    ])
                }
            }
        },
        methods: {
            onCancel () {
                this.$emit('on-cancel')
            }
        }
    }
</script>

<style lang="scss" scoped>
    $summary-width-lg: 425px;
    $summary-width-md: 300px;
    $summary-width-sm: 90px;
    $wizard-max-height: 670px;

    .wizard-step {
        width: calc(100% - #{$summary-width-sm});

        @screen md {
            width: calc(100% - #{$summary-width-md});
        }

        @screen lg {
            width: calc(100% - #{$summary-width-lg});
        }

        &.full-width {
            width: 100%;
        }
    }

    .wizard-summary {
        max-height: $wizard-max-height;
        overflow: auto;
        width: $summary-width-sm;

        @screen md {
            width: $summary-width-md;
        }

        @screen lg {
            width: $summary-width-lg;
        }
    }

    .steps-topbar-pagination {
        line-height: 17px;
    }

    .steps-topbar-get-help {
        @apply text-active-elements text-base font-bold ml-1 select-none;
        line-height: 17px;
    }

    .steps-wrapper {
        min-height: 480px;
        position: relative;
        overflow: hidden;
    }

    ::v-deep .step-content-wrapper {
        overflow-y: auto;
        min-height: 480px;
        max-height: calc(#{$wizard-max-height} - 124px - 60px);
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

    .wizard-wrapper {

        $wizard-max-height: 600px;
        &.wizard-height-sm {
            .wizard-summary {
                max-height: $wizard-max-height;
            }

            ::v-deep .step-content-wrapper {
            max-height: calc(#{$wizard-max-height} - 124px - 60px);
        }
        }

        $wizard-max-height: 750px;
        &.wizard-height-lg {
            .wizard-summary {
                max-height: $wizard-max-height;
            }

            ::v-deep .step-content-wrapper {
                max-height: calc(#{$wizard-max-height} - 124px - 60px);
            }
        }
    }
</style>
