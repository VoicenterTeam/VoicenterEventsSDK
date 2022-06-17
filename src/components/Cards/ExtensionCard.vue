<template>
    <div
        class="bg-white p-3 mb-2 rounded-lg shadow w-75 flex flex-col extension-card"
        :style="{
            ...cardStyles,
            ...withMoreInfo
        }"
    >
        <div class="flex items-center mb-4">
            <fade-transition mode="out-in">
                <el-tooltip
                    :key="extension.representativeStatus" :content="statusText" placement="top"
                    :open-delay="300"
                >
                    <component
                        :is="statusIcon"
                        :key="extension.representativeStatus"
                        :class="{'is-calling': isCalling, 'is-talking': isTalking}"
                        class="extension-card-icon"
                    />
                </el-tooltip>
            </fade-transition>
            <span
                class="text-main-xl text-steel font-bold leading-tight mx-2 break-normal cut-text"
            >
                {{ getRepresentativeSummery }}
            </span>
        </div>
        <div class="flex flex-col flex-1">
            <div class="flex items-center">
                <div class="flex items-center justify-center">
                    <span class="text-center text-main-3xl font-bold time">{{ timer.displayTime }}</span>
                    <!-- <IconThreshold
                        v-if="threshold.show"
                        v-bind="threshold.styles"
                        class="w-6 mt-2 mx-2"
                    /> -->
                </div>
            </div>
            <call-info
                v-for="call in extension.calls"
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
        <span
            class="divide-y h-px w-full divide-horizontal mb-1"
        />
        <div @click="showMoreInfo" class="cursor-pointer text-center -mb-4">
            <i
                class="vc-icon-down text-xl text-primary"
                :class="{ 'arrow-transition': additionalBlock, 'arrow-transitionq':  !additionalBlock }"
            />
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Timer from '@/util/Timer'
    import { Tooltip } from 'element-ui'
    import statusTypes from '@/enum/statusTypes'
    import { extensionColor } from '@/util/extensionStyles'
    import { getInitialExtensionTime } from '@/util/timeUtils'
    
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
                additionalBlock: false
            }
        },
        computed: {
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
            cardStyles() {
                let color = extensionColor(this.extension)
                return {
                    border: `2px solid ${color}`,
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
        },
        methods: {
            setTimerValue() {
                const timerValue = getInitialExtensionTime(this.extension, this.settings)
                this.timer.setValue(timerValue)
            },
            showMoreInfo () {
                console.log(this.$el, '$el')
                this.additionalBlock = !this.additionalBlock
                this.withMoreInfo = {
                    'position': 'absolute',
                    'bottom': '0',
                    'left': '0'
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
<style scoped>
.extension-card {
    min-height: 200px;
    transition: all .2s;
}
/* .extension-card::after {
    content: ' ';
    position: relative;
    min-height: 200px;
    @apply w-75;
} */

.extension-card-icon {
    max-width: 25px;
    min-width: 25px;
}
.cut-text { 
    text-overflow: ellipsis;
    overflow: hidden; 
    width: 200px; 
    white-space: nowrap;
}
.time {
    font-size: 40px;
    line-height: 49px;
    color: var(--dark-gray);
}
.arrow-transition {
    display: inline-block;
    transition: transform 0.5s ease-in-out;
    transform: rotate(180deg);
}
.arrow-transitionq {
    display: inline-block;
    transition: transform 0.5s ease-in-out;
    transform: rotate(0);
}
.divide-horizontal {
    background: var(--gray-350);
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
