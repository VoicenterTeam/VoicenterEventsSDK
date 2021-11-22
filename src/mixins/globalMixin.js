import { delay } from '@/helpers/util'

export default {
    methods: {
        async addTokenToUrl() {
            await delay()
            if (this.$route && this.$route.name === 'generate-pdf') {
                return
            }
            let activeTokens = this.$store.getters['users/activeTokens']
            const urlQuery = this.$route.query
            this.$router.push(
                {
                    query: {
                        ...urlQuery,
                        token: activeTokens,
                    },
                },
            ).catch((e) => {
                console.warn(e)
            })
        },
    },
    watch: {
        '$route.name': {
            immediate: true,
            deep: true,
            handler: async function (value) {
                if (!value) {
                    return
                }
                await this.addTokenToUrl()
            },
        },
    },
}
