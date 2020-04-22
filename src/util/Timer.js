import {timeFormatter} from "@/helpers/timeFormatter";

export default class Timer {
    constructor (options = {interval: 1000, initialTimeInSeconds: 0}) {
        this.state = {
            seconds: options.initialTimeInSeconds || 0
        }
        this.options = options
        this.interval = null
    }

    get displayTime () {
        return timeFormatter(this.state.seconds)
    }

    reset () {
        this.state.seconds = 0
    }

    setValue (value) {
        this.state.seconds = value
    }

    start () {
        if (this.interval) {
            clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
            this.state.seconds++
        }, this.options.interval || 1000)
    }

    stop () {
        clearInterval(this.interval)
    }

    destroy () {
        clearInterval(this.interval)
    }
}
