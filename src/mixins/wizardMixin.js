import {mapGetters} from "vuex";

export const wizardMixin = {
    props: {
        entityName: String,
        model: {
            type: Object
        },
        stepIndex: {
            type: Number,
            default: 0
        },
        showSummary: {
            type: Boolean,
            default: true
        },
        showTopBar: {
            type: Boolean,
            default: true
        },
        showCreateAnotherData: {
            type: Boolean,
            default: true
        },
        showPreviousButton: {
            type: Boolean,
            default: true
        },
        nextButtonCheck: {
            type: Boolean,
            default: true
        },
        disableFinishButton: {
            type: Boolean,
            default: false
        },
        height: {
            type: String,
            default: 'md',
            description: 'sm | md | lg'
        },
        dataLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            steps: [],
            activeIndex: -1,
            createAnotherData: false
        }
    },
    provide() {
        return {
            steps: this.steps,
            addStep: this.addStep,
            removeStep: this.removeStep,
            onStepClick: this.onStepClick
        };
    },
    watch: {
        activeIndex(newVal) {
            this.steps.forEach(step => {
                step.activeIndex = newVal
            })
            this.$emit('update-step', newVal)
        },
        stepIndex() {
            this.activeIndex = this.stepIndex
        }
    },
    computed: {
        // ...mapGetters('utils', ['screenSize']),
        onFirstStep() {
            return this.activeIndex === 0;
        },
        onLastStep() {
            return this.activeIndex + 1 === this.steps.length
        },
        // buttonSize() {
        //     return ['mobile', 'tablet'].includes(this.screenSize) ? 'sm' : 'md'
        // }
    },
    methods: {
        reset(index = 0) {
            this.activeIndex = index;

            if (this.$refs.summary) {
                this.$refs.summary.stepElements.forEach(summaryEl => {
                    summaryEl.lastPassed = -1;
                    summaryEl.lastVisitedStep = index;
                })
            }
        },
        async validate(step) {
            const tabToValidate = step || this.steps[this.activeIndex];
            const beforeLeave = tabToValidate.beforeLeave;

            if (beforeLeave) {
                return Promise.resolve(beforeLeave())
            } else {
                return Promise.resolve(true);
            }
        },
        addStep(step) {
            const index = this.steps.length;
            step.index = index;

            this.steps.splice(index, 0, step);
        },
        removeStep(step) {
            const steps = this.steps;
            const index = steps.indexOf(step);

            if (index > -1) {
                steps.splice(index, 1);
            }
        },
        async onStepClick(goToIndex) {
            if (this.value === goToIndex || this.isMobile) {
                return;
            }

            if (this.activeIndex < goToIndex) {
                await this.moveThroughSteps(goToIndex, this.activeIndex);
            } else {
                await this.goToStep(goToIndex, 'left')
            }
        },
        async moveThroughSteps(goToIndex, passedIndex) {
            await this.goToStep(passedIndex, 'right');
            passedIndex++

            const isValid = await this.validate();

            if (!isValid || passedIndex > goToIndex) {
                return
            }

            await this.moveThroughSteps(goToIndex, passedIndex)
        },
        async onNext() {
            const isValid = await this.validate();

            if (isValid) {
                await this.goToStep(this.activeIndex + 1, 'right')
            }
        },
        async onPrevious() {
            await this.goToStep(this.activeIndex - 1, 'left')
        },
        async goToStep(index, direction) {
            this.steps.forEach(step => {
                step.direction = direction;
            });

            await this.$nextTick()

            this.activeIndex = index;
        },
        onCancel() {
            this.$emit('cancel');
        },
        onFinish() {
            this.$emit('finish', {
                createAnotherData: this.createAnotherData
            });
        }
        // onHelp() {
        //     this.$emit('help')
        // }
    },
    mounted() {
        this.activeIndex = this.stepIndex;
    }
};
