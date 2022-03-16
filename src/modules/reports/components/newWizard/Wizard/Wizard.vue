<template>
    <!-- <mobile-wizard v-if="isMobile" v-bind="$attrs" v-on="$listeners" ref="wizard">
        <slot></slot>
    </mobile-wizard> -->
    <default-wizard v-bind="$attrs" v-on="$listeners" ref="wizard" :data-test-name="dataTestName">
        <slot></slot>
        <template slot="extra-actions">
            <slot name="extra-actions"></slot>
        </template>
    </default-wizard>
</template>

<script>
    import {mapGetters} from "vuex";
    // import MobileWizard from "@/modules/reports/newWizard/components/Wizard/MobileWizard";
    import DefaultWizard from "@/modules/reports/components/newWizard/Wizard/DefaultWizard";
    // import EventBus from 'src/util/eventBus';

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
            // TODO: add loading
        },
        components: {
            DefaultWizard
            // MobileWizard,
        },
        computed: {
            ...mapGetters('utils', ['isMobile', 'isTablet']),
        },
        methods:{
            reset(value){
                this.$refs.wizard.reset(value)
            },
            goToStep(value){
                this.$refs.wizard.goToStep(value, 'right')
            }
        },
        // created() {
        //     EventBus.$on('wizard-reset', (value) => {
        //         this.reset(value)
        //     })
        // },
        // beforeDestroy() {
        //     EventBus.$off('wizard-reset')
        // }
    }
</script>
