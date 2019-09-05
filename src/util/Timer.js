import Vue from 'vue'

export default class Timer {
    constructor(options = {interval: 1000, initialTimeInSeconds: 0}) {
        this.state = {
            seconds: options.initialTimeInSeconds || 0
        }
        this.options = options
        this.interval = null
    }

    get displayTime() {
        let minutes = Math.floor(this.state.seconds / 60)
        let seconds = Math.floor(this.state.seconds % 60)
        let hours = 0;
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        if (minutes > 60) {
            hours = Math.floor(minutes / 60)
            minutes = Math.floor(minutes % 60)
        }
        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        if (hours < 10) {
            hours = `0${hours}`
        }
        if (hours > 0) {
            return `${hours}:${minutes}:${seconds}`
        }
        return `${minutes}:${seconds}`
    }

    reset() {
        this.state.seconds = 0
    }

    start() {
        this.interval = setInterval(() => {
            this.state.seconds++
        }, this.options.interval || 1000)
    }

    destroy() {
        clearInterval(this.interval)
    }

}
