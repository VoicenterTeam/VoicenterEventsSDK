export default {
    methods: {
        addTokenToUrl() {
            let activeTokens = this.$store.getters['users/activeTokens']
            this.$router.push({ query: { token: activeTokens } }).catch(() => {
            })
        },
    },
    watch: {
        '$route.name': {
            immediate: true,
            deep: true,
            handler(value) {
                if (!value) {
                    return
                }
                this.addTokenToUrl()
            },
        },
    },
}
