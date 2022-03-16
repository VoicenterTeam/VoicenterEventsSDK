<template>
    <div class="summary-step inactive"
         :class="{
            'active': isActive,
            'visited': isVisited,
            'passed': isPassed
         }"
         @click="onClick">
        <template v-if="stepData">
            <div class="summary-step-progress">
                <div v-if="!isLast" class="summary-step-progress-line">
                    <div class="flex flex-col justify-around items-center h-full w-full absolute">
                       <div v-for="i in 3" :key="i">
                           <i  class="vc-icon-down icon-base text-white"/>
                       </div>
                    </div>
                </div>
                <div class="summary-step-progress-circle">
                    <div class="summary-step-progress-circle-point"></div>
                    <div class="summary-step-progress-circle-icon">
                        <i :class="[stepData.icon, isVisited ? 'text-active-elements' : 'text-inactive-elements']" class="vc-icon-settings icon-2xl min-w-8"></i>
                    </div>
                </div>
            </div>
            <div class="summary-step-content hidden md:block">
                <div class="flex justify-between">
                    <span class="summary-step-content-header leading-none">
                        <slot name="header">
                            <h2 class="mb-0 text-sm lg:text-base font-bold uppercase">
                                {{ index + 1 }}.&nbsp; <!-- TODO: need to add translations -->
                            </h2>
                        </slot>
                    </span>
                    <FadeTransition :duration="200" mode="out-in">
                        <i class="vc-edit-pencil icon-base text-active-elements" v-if="isVisited && !isActive"/>
                    </FadeTransition>
                </div>
                <ScaleTransition :duration="200" mode="out-in">
                    <div v-if="isVisited" class="summary-step-content-list mt-4 hidden md:block">
                        <slot name="summary"/>
                    </div>
                </ScaleTransition>
            </div>
        </template>
    </div>

</template>

<script>
    import {FadeTransition, ScaleTransition} from 'vue2-transitions';
    import {wizardStepMixin} from "@/mixins/wizardStepMixin";

    export default {
        name: 'WizardSummaryStep',
        mixins: [wizardStepMixin],
        components: {
            ScaleTransition,
            FadeTransition
        }
    }
</script>

<style lang="scss" scoped>
    $point-size: 16px;
    $point-circle-size: 30px;

    .summary-step {
        display: -webkit-box;

        &.inactive, &.active, &.visited {
            .summary-step-progress {
                @apply border-gray-500;
            }
        }

        &.passed {
            .summary-step-progress {
                @apply border-progress-line-done;
            }
        }

        &.active {
            .summary-step-content-header, .summary-step-content-header > * {
                @apply text-active-elements;
            }

            .summary-step-progress-circle {
                @apply border-active-elements;
                background-color: rgba(var(--active-elements--rgb), 0.25);
            }
        }

        &.visited:hover {
            .summary-step-content-header {
                @apply text-active-elements;
            }
        }
        &.visited {
            @apply cursor-pointer;
        }

        &.visited, &.active {
            .summary-step-progress-circle-point {
                @apply border-active-elements;
            }

            .summary-step-progress-circle-icon {
                @apply text-active-elements;
            }
        }
    }

    .summary-step-progress {
        @apply relative flex-grow-0;
        min-height: 80px;
        width: $point-size;
    }

    .summary-step-progress-circle {
        @apply absolute rounded-full border;
        width: $point-circle-size;
        height: $point-circle-size;
        transform: translateY(-$point-size / 2);
        left: -50%;
        background: transparent;
        border-color: transparent;
        z-index: 1;
        transition: .3s ease-out;
    }

    .summary-step-progress-circle-point {
        @apply absolute border-4 border-gray-500 bg-white rounded-full;
        width: $point-size;
        height: $point-size;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
    }

    .summary-step-progress-circle-icon {
        @apply absolute;
        right: calc(100% + 15px);

        svg {
            path {
                transition: fill .3s ease-out;
            }
        }
    }

    .summary-step-progress-line {
        width: 6px;
        top: $point-size - 2px;
        bottom: 0;
        left: 4px;
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
        padding-left: 15px;
        margin-bottom: 50px;

        .summary-step-content-header, .summary-step-content-header > h2 {
            transition: color .1s ease-out;
        }

        &__field {
            @apply text-sm;
        }
    }

    .rtl {
        .summary-step-content {
            padding-left: 0;
            padding-right: 15px;
        }
        .summary-step-progress-circle-icon {
            @apply absolute;
            right: unset;
            left: calc(100% + 15px);
        }
        .summary-step-content-list {
            text-align: right;
        }
    }
</style>
