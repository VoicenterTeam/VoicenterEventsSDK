export default {
    computed: {
        allQueues() {
            return this.$store.state.queues.all
        },
        filteredQueues() {
            if (!this.data.WidgetLayout.showQueues) return []
            return this.allQueues.filter(e => this.data.WidgetLayout.showQueues.includes(e.QueueID))
        },
        queueWithActiveCalls() {
            return this.$store.state.queues.all.filter((el) => el.Calls.length)
        },
        filteredQueuesWithActiveCalls() {
            if (!this.data.WidgetLayout.showQueues) return []
            return this.queueWithActiveCalls.filter(e => this.data.WidgetLayout.showQueues.includes(e.QueueID))
        },
        allQueueCalls() {
            let allCalls = []
            this.queueWithActiveCalls.forEach((queue) => {
                allCalls.push(queue.Calls[0])
            })
            return allCalls
        }
    }
}
