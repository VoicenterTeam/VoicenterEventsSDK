export default {
    computed: {
        extensions () {
            return this.$store.state.extensions.extensions
        },
        extensionWithCalls () {
            return this.$store.getters['extensions/extensionsWithCalls'](false) || []
        },
    }
}
