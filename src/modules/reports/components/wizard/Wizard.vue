<template>
    <default-wizard v-bind="$attrs" v-on="$listeners" ref="wizard" :data-test-name="dataTestName" @on-cancel="onCancel">
        <slot></slot>
        <template slot="extra-actions">
            <slot name="extra-actions"></slot>
        </template>
    </default-wizard>
</template>

<script>
    import {mapGetters} from "vuex";
    import DefaultWizard from "@/modules/reports/components/wizard/DefaultWizard";

    export default {
        name: 'Wizard',
        props: {
            name: {
                type: String,
                default: ''
            },
            dataTestName: {
                type: String,
                default: ''
            }
        },
        components: {
            DefaultWizard
        },
        methods:{
            goToStep(value){
                this.$refs.wizard.goToStep(value, 'right')
            },
            onCancel () {
                this.$emit('on-cancel')
            }
        }
    }
</script>
