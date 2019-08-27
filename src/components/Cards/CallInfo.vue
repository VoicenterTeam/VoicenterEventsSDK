<template>
    <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col">
            <span class="text-gray-500 text-xs mr-2">+{{call.callerphone}}</span>
            <span v-if="call.callerphone !== call.callername" class="text-xs font-medium">{{call.callername}}</span>
        </div>
        <component :is="directionMappings[call.direction]" class="w-6 direction-icon"></component>
        <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"></component>
        <span class="font-medium tracking-wide call-time font-mono">{{timer.displayTime}}</span>
    </div>
</template>
<script>
    import Timer from './Timer'

    export default {
        props: {
            call: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            let israelTimezoneOffset = -180 * 60 * 1000
            let initialTime = new Date().getTime() - ((this.call.callStarted * 1000) + israelTimezoneOffset)
            let initialTimeInSeconds = Math.floor(initialTime / 1000)
            return {
                timer: new Timer({
                    initialTimeInSeconds
                }),
                directionMappings: {
                    "Outgoing": "IconDirectionOutgoing",
                    "Incoming": "IconDirectionIncoming",
                },
            }
        },
        computed: {
            threshold() {
                let show = true;
                let icon = 'IconYellowBulb';
                if (!this.$store.state.settings.threshold.callThreshold) {
                    show = false;
                }
                let seconds = this.timer.state.seconds;
                let minThreshold = this.$store.state.settings.threshold.callThresholdLowValue
                let maxThreshold = this.$store.state.settings.threshold.callThresholdHeightValue

                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    icon = 'IconRedBulb'
                }
                return {show, icon}
            },
        },
        mounted() {
            this.timer.start()
        },
        beforeDestroy() {
            this.timer.destroy()
        }
    }
</script>
<style scoped>
    .call-time {
        min-width: 48px;
    }
    .rtl .direction-icon{
        trnsform: rotate(180deg);
    }
</style>
