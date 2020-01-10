<template>
    <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col">
            <span class="text-xs mr-2" :class="textColor">+{{call.callerphone}}</span>
            <span v-if="call.callerphone !== call.callername" class="text-xs font-medium">{{call.callername}}</span>
        </div>
        <component :is="directionMappings[call.direction]" class="w-6 direction-icon"/>
        <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"/>
        <span class="font-medium tracking-wide call-time font-mono">{{timer.displayTime}}</span>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {getInitialTime} from '@/util/timeUtils'

    export default {
        props: {
            call: {
                type: Object,
                default: () => ({})
            },
            textColor: {
                type: String,
                default: () => 'text-gray-500'
            },
            settings: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            let initialTimeInSeconds = getInitialTime(this.call.callStarted)
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

                if (!this.settings.callThreshold) {
                    show = false;
                }
                let seconds = this.timer.state.seconds;
                let minThreshold = this.settings.callThresholdLowValue
                let maxThreshold = this.settings.callThresholdHeightValue

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
