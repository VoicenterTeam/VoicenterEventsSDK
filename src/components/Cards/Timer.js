import Vue from 'vue'

export default class Timer {
    constructor(options = { interval: 1000 }) {
        this.state = {
            seconds: 0
        }
        this.options = options
        this.interval = null
    }

    get displayTime() {
        let minutes = Math.round(this.state.seconds / 60)
        let seconds = Math.round(this.state.seconds % 60)
        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`
    }

    reset() {
        this.state.seconds = 0
    }

    start() {
        this.interval = setInterval(() => {
            this.state.seconds++
        }, this.options.interval)
    }

    destroy() {
        clearInterval(this.interval)
    }

}
