<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-center">
            <span class="font-mono">{{timer.displayTime}}</span>
            <component v-if="threshold.show" :is="threshold.icon" class="w-6 mb-1 mx-2"/>
        </div>
        <call-info v-for="(call, index) in extension.calls" :key="index" :call="call" :textColor="'text-white'"/>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import CallInfo from '@/components/Cards/CallInfo'
    import {ISRAEL_TIMEZONE_OFFSET} from '@/enum/generic'

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
        },
        data() {
            let initialTime = new Date().getTime() - (this.extension.representativeUpdated - ISRAEL_TIMEZONE_OFFSET)
            let initialTimeInSeconds = Math.floor(initialTime / 1000)

            return {
                timer: new Timer({
                    initialTimeInSeconds
                })
            }
        },
        watch: {
            'extension.representativeStatus'() {
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
