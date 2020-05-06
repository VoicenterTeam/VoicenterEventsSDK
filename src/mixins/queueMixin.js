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
            return this.$store.getters['queues/queueWithActiveCalls'] || []
        },
        filteredQueuesWithActiveCalls() {
            if (!this.data.WidgetLayout.showQueues) return []
            return this.queueWithActiveCalls.filter(e => this.data.WidgetLayout.showQueues.includes(e.QueueID))
        },
        allQueueCalls() {
            return this.$store.getters['queues/allQueueCalls'] || []
        }
    }
}
