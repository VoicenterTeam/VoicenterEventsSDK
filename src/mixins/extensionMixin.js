import get from "lodash/get";

export default {
    computed: {
        extensions () {
            return this.$store.state.extensions.extensions
        },
        extensionWithCalls () {
            let hideLoggedOutUsers = get(this.data.WidgetLayout, 'hideLoggedOutUsers')
            const getExtensions = this.$store.getters['extensions/extensionsWithCalls']
            if (!getExtensions) {
                return []
            }
            return getExtensions(hideLoggedOutUsers)
        },
    }
}
