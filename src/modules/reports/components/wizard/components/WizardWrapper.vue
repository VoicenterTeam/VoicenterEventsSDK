<template>
    <div class="pt-16">
        <WizardStep v-for="(step, index) in steps"
                    v-bind="step"
                    :index="index + 1"
                    :key="step.name"
                    @on-edit-step="$emit('on-edit-step', index)"
        />
    </div>
</template>
<script>    
    export default {
        components: {
            WizardStep: () => import('@/modules/reports/components/wizard/components/WizardStep')
        },
        props: {
            steps: {
                type: Array,
                default: () => [],
            },
        },
    }
</script>
