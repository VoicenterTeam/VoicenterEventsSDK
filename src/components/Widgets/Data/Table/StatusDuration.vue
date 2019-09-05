<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-center">
            <span class="font-mono">{{timer.displayTime}}</span>
            <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"></component>
        </div>
        <call-info v-for="(call, index) in extension.calls" :key="index" :call="call" :textColor="'text-white'"/>
    </div>
</template>

<script>

    import Timer from "@/util/Timer";
    import CallInfo from "@/components/Cards/CallInfo";

    const ISRAEL_TIMEZONE_OFFSET = -180 * 60 * 1000;

    export default {
        components: {
            CallInfo
        },
        props: {
            extension: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            threshold() {
                let show = true;
                let icon = 'IconYellowBulb';
                if ((Array.isArray(this.extension.calls) &&
                    this.extension.calls.length > 0) ||
                    !this.$store.state.settings.threshold.generalThreshold) {
                    show = false;
                }
                let seconds = this.timer.state.seconds;
                let minThreshold = this.$store.state.settings.threshold.generalThresholdLowValue
                let maxThreshold = this.$store.state.settings.threshold.generalThresholdHeightValue

                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    icon = 'IconRedBulb'
                }
                return {show, icon}
            },
        },
        data() {
            let initialTime = new Date().getTime() - (this.extension.representativeUpdated + ISRAEL_TIMEZONE_OFFSET)
            let initialTimeInSeconds = Math.floor(initialTime / 1000)

            return {
                timer: new Timer({
                    initialTimeInSeconds
                })
            }
        },
        watch: {
            'extension.representativeStatus'() {
                this.timer.reset()
            }
        },
        mounted() {
            this.timer.start()
        },
        beforeDestroy() {
            this.timer.destroy()
        }
    }
</script>
