<template>
    <div class="summary-steps-wrapper lg:mt-24 mt-6">
        <div class="summary-steps" v-if="model">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce'

    export default {
        name: 'WizardSummary',
        props: {
            active: Number,
            steps: {
                type: Array,
                required: true
            },
            model: {
                type: Object
            }
        },
        data() {
            return {
                stepElements: [],
            }
        },
        provide() {
            return {
                addStep: this.addStep,
                removeStep: this.removeStep
            };
        },
        watch: {
            stepElements(updated) {
                updated.forEach((stepElement, index) => {
                    stepElement.isLast = updated.length - 1 === index
                })
            },
            active(newVal) {
                this.updateStepElementsActive(newVal)
            },
            model: {
                handler(newVal) {
                    debounce(this.updateStepElementsModel.bind(this, newVal), 1300)
                },
                deep: true
            }
        },
        methods: {
            updateStepElementsActive(newIndex) {
                this.stepElements.forEach(stepElement => {
                    stepElement.active = newIndex
                })
            },
            updateStepElementsModel(newModel) {
                this.stepElements.forEach(stepElement => {
                    stepElement.model = newModel
                })
            },
            addStep(step) {
                const index = this.stepElements.length;
                step.index = index;
                step.active = this.active;
                step.model = this.model;
                step.stepData = this.steps[index]
                step.numberOfSteps = this.steps.length

                this.stepElements.splice(index, 0, step);
            },
            removeStep(step) {
                const steps = this.stepElements;
                const index = steps.indexOf(step);

                if (index > -1) {
                    steps.splice(index, 1);
                }
            },
        },
        mounted() {
            this.updateStepElementsActive(this.active)
            this.updateStepElementsModel(this.model)
        }
    }
</script>

<style lang="scss" scoped>
    .summary-steps-wrapper {
        @apply mx-4;

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
</style>
