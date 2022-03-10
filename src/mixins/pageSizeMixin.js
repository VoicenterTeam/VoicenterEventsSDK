export default {
    methods: {
        resizeThrottler() {
            let resizeTimeout;
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(() => {
                    resizeTimeout = null;
                    this.actualResizeHandler();
                    // The actualResizeHandler will execute at a rate of 15fps
                }, 66);
            }
        },
        actualResizeHandler() {
            this.$store.commit('utils/SET_PAGE_WIDTH', window.innerWidth);
            this.$store.commit('utils/SET_PAGE_HEIGHT', window.innerHeight);
            this.$store.commit('utils/SET_VIEW_PORT');
        }
    },
    mounted() {
        this.actualResizeHandler();
        window.addEventListener('resize', this.resizeThrottler, false);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeThrottler);
    },

};
