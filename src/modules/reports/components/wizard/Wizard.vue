<template>
    <div>
        <WizardWrapper
            :steps="steps"
            :currentStep="currentStep"
            v-on="$listeners"
        />
    </div>
</template>
<script>
    import WizardWrapper from '@/modules/reports/components/wizard/components/WizardWrapper'
    
    export default {
        components: {
            WizardWrapper,
        },
        props: {
            currentStep: {
                type: Number,
                default: 0,
            },
            steps: {
                type: Number,
                default: 0
            }
        },
        watch: {
            currentStep(value) {
                this.wizardData.updateStep(value)
            },
        },
    }
</script>
