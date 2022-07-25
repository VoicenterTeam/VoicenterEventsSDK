<template>
    <div
        class="bg-white p-3 mb-2 rounded-lg shadow w-75 flex flex-col extension-card"
        :style="{
            ...cardStyles,
            ...withMoreInfo
        }"
    >
        <div
            class="flex items-center"
            :class="extension.calls.length >= minActiveCallsNumber  ? 'mb-2' : 'mb-4'"
            :style="styleForStatusIconColor"
        >
            <fade-transition mode="out-in">
                <el-tooltip
                    :key="extension.representativeStatus" :content="statusText" placement="top"
                    :open-delay="300"
                >
                    <component
                        :is="statusIcon"
                        :key="extension.representativeStatus"
                        :class="{ 'is-calling': isCalling, 'is-talking': isTalking }"
                        class="extension-card-icon"
                    />
                </el-tooltip>
            </fade-transition>
            <span
                class="text-main-xl text-steel font-bold leading-tight mx-2 break-normal cut-header"
            >
                {{ getRepresentativeSummery }}
            </span>
        </div>
        <div
            class="flex flex-col flex-1"
        >
            <div class="flex items-center justify-between">
                <span
                    class="font-bold time cut-timer"
                    :style="getTimerStyle"
                    :class="extensionCalls.length >= minActiveCallsNumber ? 'small-text' : 'big-text'"
                >
                    {{ timer.displayTime }}
                </span>
                <span
                    class="font-bold time"
                    :class="extensionCalls.length >= minActiveCallsNumber ? 'small-text' : 'big-text'"
                >
                    <i
                        :style="{ 'color': iconColor.color }"
                        :class="`vc-icon-${iconColor.type}`"
                    />
                </span>
            </div>
            <div class="mb-2">
                <call-info
                    v-for="call in extensionCalls"
                    :key="call.ivrid"
                    :status-threshold="threshold"
                    :call="call"
                    :settings="settings"

                >
                    <template v-slot:threshold="{statusThreshold}">
                        <IconThreshold
                            v-if="statusThreshold.show"
                            v-bind="statusThreshold.styles"
                            class="w-6 mb-1 mx-2"
                        />
                    </template>
                </call-info>
            </div>
        </div>
        <div class="w-full" v-if="extension.calls.length > minActiveCallsNumber">
            <span
                class="divide-y h-px w-full divide-horizontal mb-1"
            />
            <div @click="showMoreInfo" class="cursor-pointer text-center -mb-4">
                <i
                    class="vc-icon-down text-xl text-primary"
                    :class="{ 'arrow-transition-down': additionalBlock, 'arrow-transition-up':  !additionalBlock }"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Timer from '@/util/Timer'
    import { Tooltip } from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import { getInitialExtensionTime } from '@/util/timeUtils'
    import cloneDeep from 'lodash/cloneDeep'
    import values from "lodash/values";
    const MIN_ACTIVE_CALLS_NUMBER = 2

    export default {
        components: {
            CallInfo: () => import('./CallInfo'),
            [Tooltip.name]: Tooltip,
        },
        props: {
            extension: {
                type: Object,
                default: () => ({}),
            },
            settings: {
                type: Object,
                default: () => ({}),
            },
            thresholdConfig: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            let initialTimeInSeconds = getInitialExtensionTime(this.extension, this.settings)

            return {
                timer: new Timer({
                    initialTimeInSeconds,
                }),
                statusMappings: statusTypes,
                withMoreInfo: {},
                additionalBlock: false,
                minActiveCallsNumber: MIN_ACTIVE_CALLS_NUMBER
            }
        },
        computed: {
            getTimerStyle() {
                let { color } = this.getColorByStatusAlerts('#445162')

                return { color }
            },
            getRepresentativeSummery() {
                return get(this.extension, 'summery.representative', 'userName')
            },
            threshold() {
                let show = true
                let seconds = this.timer.state.seconds
                let thresholdColor = this.thresholdConfig.HoldTimeWarningColor

                const { HoldTimeWarning, HoldTimeLimit } = this.thresholdConfig

                if (!HoldTimeWarning && !HoldTimeLimit || (this.extension.calls.length && this.settings.callThreshold)) {
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
                    thresholdColor = this.thresholdConfig.HoldTimeLimitColor
                }
                return {
                    show,
                    styles: {
                        color: thresholdColor,
                    },
                }
            },
            getColorByAccountBreakLimit () {
                let { color, type } = this.getColorByStatusAlerts('white', true)

                return {
                    color,
                    type
                }
            },
            cardStyles () {
                const {color} = this.getColorByAccountBreakLimit

                return {
                    border: `1px solid ${color}`,
                }
            },
            iconColor () {
                const {color, type} = this.getColorByAccountBreakLimit

                return {
                    color,
                    type
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
            },
            extensionCalls () {
                const extensionCalls = cloneDeep(this.extension.calls)
                if (!this.additionalBlock) {
                    return extensionCalls.slice(0, 2)
                }
                return extensionCalls
            },
            getAccountStatuses () {
                return this.$store.getters['entities/accountStatuses']
            },
            styleForStatusIconColor () {
                let data = this.statusMappings[this.extension.representativeStatus] || { icon: 'IconOther' }
                const dynamicColor = this.getAccountStatuses.find(el => Number(el.StatusID) === Number(data.value))
                const color = dynamicColor && dynamicColor.ColorCode ? dynamicColor.ColorCode : data.color

                return {
                    '--status-svg-color': color
                }
            }
        },
        methods: {
            setTimerValue() {
                const timerValue = getInitialExtensionTime(this.extension, this.settings)
                this.timer.setValue(timerValue)
            },
            showMoreInfo () {
                this.additionalBlock = !this.additionalBlock
                this.withMoreInfo = {
                    'position': this.additionalBlock ? 'absolute' : 'relative',
                    ...(this.additionalBlock && ({
                        'top': '0px',
                        'left': '4px',
                        'z-index': '1',
                        'box-shadow': '0px 0px 5px rgba(38, 117, 255, 0.5)'
                    })),
                }
            },
            getColorByStatusAlerts (defaultColor, addTypeForData = false) {
                let color = defaultColor
                let type = ''
                const statusAlerts = this.$store.getters['entities/getAccountBreakLimit'](this.extension.representativeStatus)
                const { loginStatusLimit, loginStatusWarning } = this.$store.getters['layout/colors']('activeLayout')

                if (statusAlerts && 'warn' in statusAlerts && (this.timer.state.seconds >= statusAlerts.warn)) {
                    color = loginStatusWarning
                    type = 'info'
                }

                if (statusAlerts && 'alert' in statusAlerts && (this.timer.state.seconds >= statusAlerts.alert)) {
                    color = loginStatusLimit
                    type = 'alert'
                }

                return {
                    color,
                    ...(addTypeForData && {type})
                }
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
            },
        },
        mounted() {
            this.timer.start()
        },
        beforeDestroy() {
            this.timer.destroy()
        },
    }
</script>
<style lang="scss" scoped>
@mixin cutText($maxWidth) {
    text-overflow: ellipsis;
    overflow: hidden;
    width: $maxWidth;
    white-space: nowrap;
}
.extension-card {
    min-height: 190px;
    transition: all .2s;
    position: relative;
}

.extension-card-icon {
    max-width: 25px;
    min-width: 25px;
}
.cut-header {
    @include cutText(200px);
}
.cut-timer {
    @include cutText(185px);
}
.time {
    color: var(--dark-gray);
}
.small-text {
    font-size: 24px;
    line-height: 29px;
}
.big-text {
    font-size: 40px;
    line-height: 49px;
}
.arrow-transition-down {
    display: inline-block;
    transition: transform 0.5s ease-in-out;
    transform: rotate(180deg);
}
.arrow-transition-up {
    display: inline-block;
    transition: transform 0.5s ease-in-out;
    transform: rotate(0);
}
.divide-horizontal {
    display: block;
    width: 298px;
    background: var(--gray-350);
}
[dir="ltr"] .divide-horizontal {
   margin-left: -12px;
}
[dir="rtl"] .divide-horizontal {
    margin-right: -12px;
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

.extension-card-icon {
    width: var(--dynamic-font-size);
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
