<template>
    <div class="flex items-center justify-center">
        <span class="font-mono">{{ timer.displayTime }}</span>
        <component
            :is="statusIcon"
            :key="extension.representativeStatus"
            :class="{'is-calling': isCalling, 'is-talking': isTalking}"
            class="extension-card-icon mx-2"
        />
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {getInitialExtensionTime} from '@/util/timeUtils'
    import statusTypes from '@/enum/statusTypes'

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
                    initialTimeInSeconds,
                    realtime: true
                }),
                statusMappings: statusTypes
            }
        },
        computed: {
            threshold() {
                let show = true
                let thresholdColor = this.thresholdConfig.HoldTimeWarningColor

                let seconds = this.timer.state.seconds
                const { HoldTimeWarning, HoldTimeLimit } = this.thresholdConfig

                if (!HoldTimeWarning && !HoldTimeLimit || this.extension.calls.length) {
                    return {
                        show: false,
                        styles: {
                            color: thresholdColor,
                        },
                    }
                }
                if (HoldTimeWarning > seconds) {
                    show = false
                } else if (seconds > HoldTimeLimit && HoldTimeWarning < HoldTimeLimit) {
                    thresholdColor =  this.thresholdConfig.HoldTimeLimitColor
                }
                return {
                    show,
                    styles: {
                        color: thresholdColor
                    }
                }
            },
            thresholdConfig() {
                return this.$store.getters['layout/getThresholdConfig']('activeLayout')
            },
            statusIcon() {
                let data = this.statusMappings[this.extension.representativeStatus] || { icon: 'IconOther' }
                if (this.extension.calls.length > 0) {
                    return 'IconIncomingCall'
                }
                return data.icon
            },
            isCalling() {
                if (this.extension.calls.length === 0) {
                    return false
                }
                return this.extension.calls.every(c => c.callAnswered === 0)
            },
            isTalking() {
                if (this.extension.calls.length === 0) {
                    return false
                }
                return this.extension.calls.every(c => c.callAnswered !== 0)
            }

        },
        methods: {
          setTimerValue() {
              const timerValue = getInitialExtensionTime(this.extension, this.settings)
              this.timer.setValue(timerValue)
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
                handler(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        return;
                    }

                    if (!this.settings.resetIdleTime || !oldVal.length) {
                        this.timer.reset()
                        return;
                    }

                    let oldCall = oldVal.find((call) => call.answered)

                    if (oldCall && this.settings.resetIdleTime) {
                        this.timer.reset()
                    } else {
                        this.setTimerValue()
                    }
                },
            },
            'extension.userID'(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setTimerValue()
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
