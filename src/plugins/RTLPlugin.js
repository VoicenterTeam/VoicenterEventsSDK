export default {
    install(Vue) {
        let app = new Vue({
            data() {
                return {
                    isRTL: false
                }
            },
            methods: {
                enableRTL() {
                    this.isRTL = true
                    document.body.classList.add('rtl')
                    document.documentElement.dir = "rtl"
                },
                disableRTL() {
                    this.isRTL = false
                    document.body.classList.remove('rtl')
                    document.documentElement.dir = "ltr"
                },
            }
        })

        Vue.prototype.$rtl = app
    }
}
