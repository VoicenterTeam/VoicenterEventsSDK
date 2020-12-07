<template>
    <div class="bg-white px-6 p-4 mb-2 rounded-lg shadow w-64 flex flex-col extension-card" :style="cardStyles">
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
            <span class="text-main-xl font-medium leading-tight mx-2">{{getRepresentativeSummery}}</span>
        </div>
        <div class="flex flex-col flex-1">
            <div class="flex items-center justify-center">
                <span class="text-center text-main-xl ml-2 mt-3 font-mono">{{timer.displayTime}}</span>
                <component v-if="threshold.show" :is="threshold.icon" class="w-6 mt-2 mx-2"/>
            </div>
            <call-info
                v-for="(call, index) in extension.calls"
                :key="call.ivrid"
                :status-threshold="threshold"
                :call="call"
                :settings="settings"
            >
                <template v-slot:threshold="{statusThreshold}">
                    <component v-if="statusThreshold.show" :is="statusThreshold.icon" class="w-6 mb-1 mx-2"/>
                </template>
            </call-info>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import CallInfo from './CallInfo'
    import Timer from '@/util/Timer'
    import {Tooltip} from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import { getInitialExtensionTime } from '@/util/timeUtils'
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
            let initialTimeInSeconds = getInitialExtensionTime(this.extension, this.settings)

            return {
                timer: new Timer({
                    initialTimeInSeconds
                }),
                statusMappings: statusTypes,
            }
        },
        computed: {
            getRepresentativeSummery() {
              return get(this.extension, 'summery.representative', 'userName')
            },
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
            },
            statusInfo() {
                return this.$store.getters['entities/getStatusById'](this.extension.representativeStatus) || {}
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
