<template>
    <div class="bg-white px-6 p-4 mb-4 rounded-lg shadow w-64 extension-card" :style="cardStyles">
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
            <span class="text-xl font-medium leading-tight mx-2">{{extension.userName}}</span>
        </div>
        <div class="flex flex-col">
            <div class="flex items-center justify-center">
                <span class="text-center text-2xl ml-2 font-mono">{{timer.displayTime}}</span>
                <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"></component>
            </div>
            <call-info v-for="(call, index) in extension.calls" :key="index" :call="call"/>
        </div>
    </div>
</template>
<script>
    import CallInfo from './CallInfo'
    import Timer from '@/util/Timer'
    import {Tooltip} from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import {extensionColor} from '@/util/extensionStyles'

    const ISRAEL_TIMEZONE_OFFSET = -180 * 60 * 1000;
    export default {
        components: {
            CallInfo,
            [Tooltip.name]: Tooltip
        },
        props: {
            extension: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            let initialTime = new Date().getTime() - (this.extension.representativeUpdated + ISRAEL_TIMEZONE_OFFSET)
            let initialTimeInSeconds = Math.floor(initialTime / 1000)

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
                    !this.$store.state.dashboards.settings.threshold.generalThreshold) {
                    show = false;
                }
                let seconds = this.timer.state.seconds;
                let minThreshold = this.$store.state.dashboards.settings.threshold.generalThresholdLowValue
                let maxThreshold = this.$store.state.dashboards.settings.threshold.generalThresholdHeightValue

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
                let data = this.statusMappings[this.extension.representativeStatus] || {text: 'other'}
                let text = data.text
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
            'extension.representativeStatus'(newVal, oldVal) {
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
<style scoped>
    .extension-card {
        min-width: 270px;
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
