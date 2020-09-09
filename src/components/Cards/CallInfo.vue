<template>
    <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col" v-if="!hideCallerInfo" :class="{'w-full': hideCallInfo}">
            <span class="text-main-xs mr-2 text-gray-500">{{callerName}}</span>
        </div>
        <template v-if="!hideCallInfo">
            <component :is="directionMappings[call.direction]" class="w-6 direction-icon"/>
            <el-tooltip
                v-if="call.callstatus === 'Hold'"
                placement="top"
                :open-delay="300"
                :content="$t('status.hold')"
            >
                <icon-hold class="w-4 h-4"></icon-hold>
            </el-tooltip>
            <slot name="threshold" :statusThreshold="threshold"/>
            <span class="font-medium tracking-wide call-time font-mono">{{timer.displayTime}}</span>
        </template>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import { Tooltip } from 'element-ui'
    import { getInitialTime } from '@/util/timeUtils'

    export default {
        components: {
            [Tooltip.name]: Tooltip,
        },
        props: {
            call: {
                type: Object,
                default: () => ({}),
            },
            settings: {
                type: Object,
                default: () => ({}),
            },
            hideCallerInfo: {
                type: Boolean,
                default: false,
            },
            hideCallInfo: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            let initialTimeInSeconds = getInitialTime(this.call.callStarted)

            return {
                timer: new Timer({
                    initialTimeInSeconds,
                }),
                directionMappings: {
                    'Outgoing': 'IconDirectionOutgoing',
                    'Incoming': 'IconDirectionIncoming',
                    'Click2Call': 'IconDirectionOutgoing',
                },
            }
        },
        computed: {
            callerName() {
                if (!isNaN(Number(this.call.callername))) {
                    return `+${this.call.callername}`
                }
                return this.call.callername
            },
            threshold() {
                let show = true
                let icon = 'IconYellowBulb'

                if (!this.settings.callThreshold) {
                    show = false
                    return { show, icon }
                }
                let seconds = this.timer.state.seconds
                let minThreshold = this.settings.callThresholdLowValue
                let maxThreshold = this.settings.callThresholdHeightValue

                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    icon = 'IconRedBulb'
                }
                return { show, icon }
            },
        },
        watch: {
            'call.ivrid'(newId, oldId) {
                if (newId !== oldId) {
                    const timerValue = getInitialTime(this.call.callStarted)
                    this.timer.setValue(timerValue)
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
<style scoped lang="scss">
    .call-time {
        min-width: 48px;
    }

    .rtl .direction-icon {
        transform: rotate(180deg);
    }
</style>
