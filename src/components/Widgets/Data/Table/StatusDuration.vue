<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-center">
            <span class="font-mono">{{timer.displayTime}}</span>
            <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"/>
        </div>
        <call-info
            v-for="(call, index) in extension.calls"
            :key="index"
            :text-color="'text-white'"
            :call="call"
            :settings="settings"
        >
            <template v-slot:threshold="{statusThreshold}">
                <component v-if="statusThreshold.show" :is="statusThreshold.icon" class="w-6 mb-1 mx-2"/>
            </template>
        </call-info>
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
        data() {
            let initialTimeInSeconds = getInitialTime(this.extension.lastAnsweredCallEventEpoch)
            return {
                timer: new Timer({
                    initialTimeInSeconds
                })
            }
        },
        computed: {
            threshold() {
                let show = true;
                let icon = 'IconYellowBulb';
                let seconds = this.timer.state.seconds;
                let minThreshold = this.statusInfo.WarningSecLimit
                let maxThreshold = this.statusInfo.AlertSecLimit

                if (!minThreshold && !maxThreshold || (this.extension.calls.length && this.settings.callThreshold)) {
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
        mounted() {
            this.timer.start()
        },
        beforeDestroy() {
            this.timer.destroy()
        }
    }
</script>
