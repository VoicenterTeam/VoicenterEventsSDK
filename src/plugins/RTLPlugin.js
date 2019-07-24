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
                    document.body.dir = "rtl"
                },
                disableRTL() {
                    this.isRTL = false
                    document.body.classList.remove('rtl')
                    document.body.dir = "ltr"
                },
            }
        })

        Vue.prototype.$rtl = app
    }
}
