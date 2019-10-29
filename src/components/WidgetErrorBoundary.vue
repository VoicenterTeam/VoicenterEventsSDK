<script>
    export default {
        data: () => ({
            error: false
        }),
        errorCaptured(err, vm, info) {
            this.error = true
            console.warn(err, vm, info)
        },
        render(h) {
            return this.error ? h('div', {
                attrs: {
                    class: 'text-lg flex justify-center items-center w-full h-32 text-red-500'
                }
            }, this.$t('widget.content.renderError')) : this.$slots.default[0]
        }
    }
</script>
<style>
</style>
