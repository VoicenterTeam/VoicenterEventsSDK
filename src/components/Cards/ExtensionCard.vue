<template>
    <div class="bg-white px-6 p-4 mb-4 rounded-lg shadow w-64 flex flex-col extension-card" :style="cardStyles">
        <div class="flex items-center mb-2">
            <fade-transition mode="out-in">
                <el-tooltip :key="extension.representativeStatus" :content="statusText" placement="top"
                            :open-delay="300">
                    <component :is="statusIcon"
                               :key="extension.representativeStatus"
                               :class="{'is-calling': isCalling, 'is-talking': isTalking}"
                               class="extension-card-icon">
                    </component>
                </el-tooltip>
            </fade-transition>
            <span class="text-main-xl font-medium leading-tight mx-2">{{extension.userName}}</span>
        </div>
        <div class="flex flex-col flex-1">
            <div class="flex items-center justify-center">
                <span class="text-center text-main-xl ml-2 mt-3 font-mono">{{timer.displayTime}}</span>
                <component v-if="threshold.show" :is="threshold.icon" class="w-6 mt-2 mx-2"/>
            </div>
            <call-info v-for="(call, index) in extension.calls" :key="index" :call="call" :settings="settings"/>
        </div>
    </div>
</template>
<script>
    import CallInfo from './CallInfo'
    import Timer from '@/util/Timer'
    import {Tooltip} from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import {getInitialTime} from '@/util/timeUtils'
    import {sdkEventReasons} from '@/enum/sdkEvents'
    import {extensionColor} from '@/util/extensionStyles'

    export default {
        components: {
            CallInfo,
            [Tooltip.name]: Tooltip
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
                }),
                statusMappings: statusTypes,
            }
        },
        computed: {
            threshold() {
                let show = true;
                let icon = 'IconYellowBulb';
                if ((Array.isArray(this.extension.calls) &&
                    this.extension.calls.length > 0) ||
                    !this.settings.generalThreshold) {
                    show = false;
                }

                let seconds = this.timer.state.seconds;
                let minThreshold = this.settings.generalThresholdLowValue
                let maxThreshold = this.settings.generalThresholdHeightValue

                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    icon = 'IconRedBulb'
                }
                return {show, icon}
            },
            cardStyles() {
                let color = extensionColor(this.extension)
                return {
                    border: `2px solid ${color}`
                }
            },
            statusText() {
                let text = this.$store.getters['entities/getStatusTextById'](this.extension.representativeStatus)
                if (this.isTalking) {
                    text = 'status.talking'
                }
                if (this.isCalling) {
                    text = 'status.calling'
                }
                return this.$t(text)
            },
            statusIcon() {
                let data = this.statusMappings[this.extension.representativeStatus] || {icon: 'IconOther'}
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
<style scoped>
    .extension-card {
        min-height: 200px;
        transition: all .2s;
    }

    .extension-card-icon {
        max-width: 48px;
        min-width: 48px;
    }
</style>
<style lang="scss">
    @keyframes fade {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .extension-card-icon.is-calling {
        path:first-child {
            animation: fade 1s;
        }

        path:last-child {
            opacity: 0;
            animation: fade 1s infinite;
            animation-direction: alternate;
            animation-delay: 1s;
        }
    }
</style>
