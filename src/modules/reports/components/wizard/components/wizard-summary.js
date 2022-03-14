export default class WizardSummary {
    constructor(data) {
        this.steps = data
    }
    
    updateStep(stepIndex) {
        this.steps = this.steps.map((el, index) => (
                {
                    ...el,
                    isActive: index <= stepIndex,
                    canEdit: index < stepIndex,
                }
            ),
        )
    }
    
    updateStepSummary(stepIndex, summary) {
        this.steps[stepIndex] = {
            ...this.steps[stepIndex],
            summary,
        }
    }
}
