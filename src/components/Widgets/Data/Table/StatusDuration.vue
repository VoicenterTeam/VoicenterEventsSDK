<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-center">
            <span class="font-mono">{{timer.displayTime}}</span>
            <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"/>
        </div>
        <call-info v-for="(call, index) in extension.calls"
                   :key="index"
                   :status-threshold="threshold"
                   :call="call"
                   :textColor="'text-white'"
                   @threshold-change="onCallThresholdChange"
        />
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {getInitialTime} from '@/util/timeUtils'
    import {sdkEventReasons} from '@/enum/sdkEvents'
    import CallInfo from '@/components/Cards/CallInfo'

    export default {
        components: {
            CallInfo
        },
        props: {
            extension: {
                type: Object,
                default: () => ({})
            },
            settings: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            threshold() {
                let show = true;
                let icon = 'IconYellowBulb';
                let seconds = this.timer.state.seconds;
                let minThreshold = this.statusInfo.WarningSecLimit
                let maxThreshold = this.statusInfo.AlertSecLimit
                if (!minThreshold && !maxThreshold || this.isCallThresholdPriority) {
                    return {
                        show: false,
                        icon
                    }
                }

                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    icon = 'IconRedBulb'
                }
                return {show, icon}
            },
            statusInfo() {
                return this.$store.getters['entities/getStatusById'](this.extension.representativeStatus) || {}
            }
        },
        data() {
            let initialTimeInSeconds = getInitialTime(this.extension.lastAnsweredCallEventEpoch)

            return {
                timer: new Timer({
                    initialTimeInSeconds
                })
            }
        },
        watch: {
            'extension.representativeStatus'() {
                this.timer.reset()
            },
            'extension.calls'(newVal, oldVal) {
                if (!this.settings.resetIdleTime && this.settings.resetIdleTime !== 'undefined') {
                    return
                }

                if (this.extension.lastEvent && this.extension.lastEvent.reason === sdkEventReasons.HANGUP) {
                    let call = oldVal.find((call) => call.answered && call.ivrid === this.extension.lastEvent.ivrid)
                    if (call) {
                        this.timer.reset()
                    }
                }
            }
        },
        methods: {
            onCallThresholdChange(callThreshold) {
                if (callThreshold.show && callThreshold.icon === 'IconRedBulb' && this.threshold.icon === 'IconYellowBulb') {
                    this.isCallThresholdPriority = true
                } else {
                    this.isCallThresholdPriority = false
                }
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
