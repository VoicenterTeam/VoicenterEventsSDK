<script>
    import get from 'lodash/get'
    export default {
        data: () => ({
            error: false,
            errorMessage: '',
            errorInfo: '',
            errorVm: ''
        }),
        errorCaptured(err, vm, info) {
            let vmName = get(vm, '$options.name', '')
            this.error = true
            this.errorMessage = `${err.message} on "${info}" inside "${vmName}" component`
            this.errorInfo = info
            this.errorVm = vm
            console.warn(err, vm, info)
        },
        render(h) {
            let children = [
                h('div', this.$t('widget.content.renderError')),
                h('div', this.errorMessage),
            ]
            let extraClasses = this.error ? 'flex-col' : ''
            return this.error ? h('div', {
                attrs: {
                    class: `text-lg flex justify-center items-center w-full h-32 text-red-500 ${extraClasses}`
                }
            }, children) : this.$slots.default[0]
        }
    }
</script>
<style>
</style>
