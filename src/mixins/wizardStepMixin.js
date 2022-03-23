export const wizardStepMixin = {
    data() {
        return {
            numberOfSteps: 1,
            active: -1,
            index: -1,
            stepData: null,
            lastPassed: -1,
            lastVisitedStep: -1,
            stepElements: [],
            isLast: false,
            model: null
        };
    },
    computed: {
        isVisited() {
            return this.index <= this.lastVisitedStep
        },
        isActive() {
            return this.index === this.active
        },
        isPassed() {
            return this.index <= this.lastPassed
        }
    },
    inject: ['addStep', 'removeStep', 'onStepClick'],
    methods: {
        onClick() {
            if (this.isVisited) {
                this.onStepClick(this.index)
            }
        }
    },
    created() {
        this.addStep(this);
    },
    watch: {
        active(newVal) {
            if (newVal > this.lastVisitedStep) {
                this.lastVisitedStep = newVal
            }

            if (newVal - 1 > this.lastPassed) {
                this.lastPassed = newVal - 1
            }
        }
    },
    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.removeStep(this);
    }
};
