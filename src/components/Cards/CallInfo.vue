<template>
    <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col" v-if="!hideCallerInfo" :class="{'w-full': hideCallInfo}">
            <span
                class="font-medium mb-1"
                :style="fontSize"
            >
                {{ call.callername }}
            </span>
            <span v-if="isMobilePhoneNumber" class="text-gray-500" :style="fontSize"><bdi>+{{ call.callerphone }}</bdi></span>
        </div>
        <div v-if="!hideCallInfo" class="flex items-center justify-between direction-icon">
            <component :is="directionMappings[call.direction]" class="mx-1"/>
            <el-tooltip
                v-if="call.callstatus === 'Hold'"
                placement="top"
                :open-delay="300"
                :content="$t('status.hold')"
            >
                <icon-hold class="w-4 h-4"></icon-hold>
            </el-tooltip>
            <div v-else class="w-4 h-4" />
            <slot name="threshold" :statusThreshold="threshold">
                <IconThreshold
                    v-if="threshold.show"
                    v-bind="threshold.styles"
                    class="mx-1"
                />
            </slot>
            <span class="font-semibold call-time" :style="fontSize">{{ timer.displayTime }}</span>
        </div>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import { Tooltip } from 'element-ui'
    import { getInitialTime } from '@/util/timeUtils'
    import { defaultFontSize } from '@/enum/defaultDashboardSettings'
    import get from 'lodash/get'
    
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
                fontSize: defaultFontSize
            }
        },
        computed: {
            threshold() {
                let show = true
                let thresholdColor = this.thresholdConfig.ActiveCallWarningColor

                if (!this.settings.callThreshold) {
                    show = false
                    return {
                        show,
                        styles: {
                            color: thresholdColor,
                        },
                    }
                }
                let seconds = this.timer.state.seconds
                let minThreshold = this.settings.callThresholdLowValue
                let maxThreshold = this.settings.callThresholdHeightValue
                
                if (minThreshold > seconds) {
                    show = false
                } else if (seconds > maxThreshold && minThreshold < maxThreshold) {
                    thresholdColor = this.thresholdConfig.ActiveCallLimitColor
                }
                return {
                    show,
                    styles: {
                        color: thresholdColor,
                    },
                }
            },
            thresholdConfig() {
                return this.$store.getters['layout/getThresholdConfig']('activeLayout')
            },
            getTypeOfLayout () {
                return this.$store.getters['layout/getTypeOfLayout']
            },
            dynamicFontSize () {
                const widgetTableContentFontSize = get(this.$store.getters['layout/widgetTableContentFontSize'](this.getTypeOfLayout), 'fontSize')
                const fontSize = widgetTableContentFontSize === '0px' ? defaultFontSize : widgetTableContentFontSize
                return {
                    'fontSize': fontSize
                }
            },
            isMobilePhoneNumber () {
                const regRule = /^[0-9+]+$/gm
                return regRule.test(this.call.callerphone)
            }
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
            if (this.$el.parentNode.hasAttribute('userid')) {
                this.fontSize = this.dynamicFontSize
            } else {
                this.fontSize = {
                    'fontSize': defaultFontSize
                }
            }
        },
        beforeDestroy() {
            this.timer.destroy()
        },
    }
</script>
<style scoped lang="scss">
.call-time {
    min-width: 48px;
    line-height: 17px;
    text-align: center;
}

.rtl .direction-icon {
    display: flex;
    flex-direction: row-reverse;
}
</style>
