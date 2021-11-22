<template>
    <div>
        <WizardWrapper :steps="wizardData.steps"
                       v-on="$listeners"/>
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
            wizardData: {
                type: Object,
                default: () => ({}),
            },
        },
        watch: {
            currentStep(value) {
                this.wizardData.updateStep(value)
            },
        },
    }
</script>
