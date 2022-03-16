<template>
    <WizardTransition :duration="150" :direction="direction">
        <div v-if="isActive && !isMobile" v-bind="$attrs" class="step-content-wrapper">
            <slot class="!isMobile"></slot>
        </div>

        <div v-if="isMobile">
            <div class="summary-steps-wrapper w-full h-full">
                <div class="summary-steps">
                    <div class="flex w-full summary-step inactive"
                         :class="{
                            'active': isActive,
                            'visited': isVisited,
                            'passed': isPassed
                         }"
                         @click="onClick">
                        <div class="w-full summary-step-progress" v-if="isVisited">
                            <div class="summary-step-progress-line">
                                <div class="flex flex-col justify-around h-full w-full absolute">
                                    <i v-for="i in 3" :key="i" class="vc-down text-white"/>
                                </div>

                                <i class="summary-step-progress-line-inner h-full"></i>
                            </div>
                            <div class="summary-step-progress-circle">
                                <div class="font-bold text-center"
                                     :class="isVisited ? 'text-active-elements' : 'text-inactive-elements'">
                                    {{ index + 1 }}.
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex flex-col pl-4 pr-2" v-if="isVisited">
                            <div class="w-full summary-step-content block">
                                <div class="w-full flex justify-between items-center">
                                    <div class="summary-step-content-header flex items-center leading-none">
                                        <slot name="header">
                                            <div>
                                                <i :class="icon" class="mx-2 icon-lg text-active-elements"></i>
                                            </div>
                                            <h2 class="mb-0 text-sm lg:text-base font-bold uppercase"
                                                :class="isActive ? 'text-active-elements' : 'text-inactive-elements'">
                                                &nbsp;{{ title }}
                                            </h2>
                                        </slot>
                                    </div>
                                    <FadeTransition :duration="200" mode="out-in">
                                        <i class="text-active-elements vc-edit-pencil icon-2md mx-4" v-if="isVisited && !isActive"/>
                                    </FadeTransition>
                                </div>
                                <div class="w-full mx-2 my-1" v-if="isActive">
                                    <slot name="steps"></slot>
                                    <div class="text-sm font-normal text-default-text">
                                        {{$t('wizard.step')}} {{ index + 1 }} {{$t('wizard.step.of')}} {{steps.length}}
                                    </div>
                                </div>
                                <ScaleTransition :duration="200" mode="out-in">
                                    <div v-if="!isActive" class="summary-step-content-list mt-4 mx-2 text-sm">
                                        <slot name="summary"/>
                                    </div>
                                </ScaleTransition>
                            </div>
                            <div v-if="isActive" class="mb-4 w-full max-h-inherit">
                                <slot></slot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </WizardTransition>
</template>

<script>
    import {mapGetters} from "vuex";
    import WizardTransition from './WizardTransition';
    import {FadeTransition, ScaleTransition} from 'vue2-transitions';

    export default {
        name: 'WizardStep',
        components: {
            FadeTransition,
            ScaleTransition,
            WizardTransition
        },
        props: {
            name: {
                type: String
            },
            icon: {
                type: String
            },
            title: {
                type: String
            },
            beforeLeave: {
                type: Function
            }
        },
        inject: ['addStep', 'removeStep', 'onStepClick', 'steps'],
        data() {
            return {
                index: -1,
                activeIndex: -1,
                direction: '',
                lastPassed: -1,
                lastVisitedStep: -1
            }
        },
        computed: {
            ...mapGetters('utils', ['isMobile']),
            isActive() {
                return this.activeIndex === this.index
            },
            isLast() {
                return this.index === this.steps.length - 1
            },
            isVisited() {
                return this.index <= this.lastVisitedStep
            },
            isPassed() {
                return this.index <= this.lastPassed
            }
        },
        watch: {
            activeIndex(newVal) {

                if(newVal === 0){
                    this.lastPassed = -1
                    this.lastVisitedStep = 0
                }

                if (newVal > this.lastVisitedStep) {
                    this.lastVisitedStep = newVal
                }

                if (newVal - 1 > this.lastPassed) {
                    this.lastPassed = newVal - 1
                }
            }
        },
        methods:{
            onClick() {
                if (this.isVisited) {
                    this.onStepClick(this.index)
                }
            },
        },
        created() {
            this.addStep(this);
        },
        destroyed() {
            if (this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }
            this.removeStep(this);
        }
    }
</script>
<style lang="scss" scoped>
    .summary-steps-wrapper {
        @apply px-4;

        @screen md {
            @apply ml-16 mr-6;
        }

        @screen lg {
            @apply ml-20 mr-8;
        }
    }

    .summary-steps {
        height: 100%;
        flex-flow: column;
    }

    .rtl {
        .summary-steps-wrapper {
            @apply mr-16 ml-6;

            @screen lg {
                @apply mr-20 ml-8;
            }
        }
    }

    .summary-step {
        display: -webkit-box;

        &.inactive, &.active, &.visited {
            .summary-step-progress {
                @apply border-field-borders;
            }
        }

        &.passed {
            .summary-step-progress {
                @apply border-progress-line-done;
            }
        }

        &.active {
            .summary-step-content-header {
                @apply text-active-elements;
            }
        }

        &.visited:hover {
            .summary-step-content-header {
                @apply text-active-elements;
            }
        }

        &.visited, &.active {
            @apply cursor-pointer;
        }
    }

    .summary-step-progress {
        @apply relative flex-grow-0;
        min-height: 80px;
        width: 6px;
    }

    .summary-step-progress-circle {
        @apply absolute;
        left: -10%;
        z-index: 1;
        transition: .3s ease-out;
    }

    .summary-step-progress-line {
        width: 6px;
        top: 25px;
        bottom: 0;
        border-color: inherit;
        @apply bg-progress-line-not-done absolute;

        .summary-step-progress-line-inner {
            @apply block w-0;
            border-width: 3px;
            border-color: inherit;
            transition: .3s ease-out;
        }
    }

    .summary-step-content {
        @apply w-full text-left flex-grow whitespace-normal;
        margin-bottom: 25px;

        .summary-step-content-header, .summary-step-content-header > h2 {
            transition: color .1s ease-out;
        }

        &__field {
            @apply text-sm;
        }
    }

    .rtl {
        .summary-step-content-list {
            text-align: right;
        }
    }
</style>
