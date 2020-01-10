<template>
    <div class="flex items-center justify-center">
        <span class="font-medium tracking-wide call-time font-mono">{{timer.displayTime}}</span>
    </div>
</template>
<script>
    import Timer from '@/util/Timer'
    import {getInitialTime} from '@/util/timeUtils'

    export default {
        props: {
            call: {
                type: Object,
                default: () => ({})
            },
            textColor: {
                type: String,
                default: () => 'text-gray-500'
            }
        },
        data() {
            let initialTimeInSeconds = getInitialTime(this.call.JoinTimeStamp)
            return {
                timer: new Timer({
                    initialTimeInSeconds
                }),
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
    .call-time {
        min-width: 48px;
    }

    .rtl .direction-icon {
        transform: rotate(180deg);
    }
</style>
