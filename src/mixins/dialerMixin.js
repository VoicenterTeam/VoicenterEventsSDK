export default {
    computed: {
        getAllDialers() {
            return this.$store.getters['dialers/getAllDialers'] || []
        },
        getAllDialersWithTypeIVR() {
            return this.$store.getters['dialers/getAllDialersWithTypeIVR'] || []
        },
        getAllDialersWithTypeAUTOMATIC() {
            return this.$store.getters['dialers/getAllDialersWithTypeAUTOMATIC'] || []
        }
    }
}
