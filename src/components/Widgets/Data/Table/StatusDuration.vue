<template>
    <div class="flex items-center justify-center">
        <span class="font-mono">{{timer.displayTime}}</span>
        <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"/>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {getInitialExtensionTime} from '@/util/timeUtils'

    export default {
        props: {
            extension: {
                type: Object,
                default: () => ({})
            },
            settings: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            let initialTimeInSeconds = getInitialExtensionTime(this.extension, this.settings)
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
                return { show, icon }
            },
            statusInfo() {
                return this.$store.getters['entities/getStatusById'](this.extension.representativeStatus) || {}
            }
        },
        watch: {
            'extension.representativeStatus'(newStatus, oldStatus) {
                if (newStatus !== oldStatus) {
                    this.timer.reset()
                }
            },
            'extension.calls': {
                deep: true,
                handler() {
                    if (!this.settings.resetIdleTime && this.settings.resetIdleTime !== 'undefined') {
                        return
                    }
                    this.timer.reset()
                },
            },
            'extension.userID'(newVal, oldVal) {
                if (newVal !== oldVal) {
                    const timerValue = getInitialExtensionTime(this.extension, this.settings)
                    this.timer.setValue(timerValue)
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
