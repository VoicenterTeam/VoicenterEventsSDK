<template>
    <div class="pt-16">
        <WizardStep
            v-for="(step, index) in steps"
            :steps="steps"
            :index="index"
            :key="step.name"
            :currentStep="currentStep"
            @on-edit-step="$emit('on-edit-step', index)"
        />
    </div>
</template>
<script>
    import WizardStep from '@/modules/reports/components/wizard/components/WizardStep'
    
    export default {
        components: {
            WizardStep,
        },
        props: {
            steps: {
                type: Number,
                default: 0
            },
            currentStep: {
                type: Number,
                default: 0
            }
        },
    }
</script>
