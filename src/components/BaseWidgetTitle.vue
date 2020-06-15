<template>
    <div class="max-h-8 flex items-center">
        <p v-if="title && showWidgetTitle" class="text-main-2xl font-semibold truncate"
           :style="widgetTitleStyles">
            <slot>
                {{$t(title)}}
            </slot>
        </p>
    </div>
</template>
<script>
    export default {
        name: 'base-widget-title',
        props: {
            title: String,
            default: ''
        },
        computed: {
            showWidgetTitle() {
                const showTitles = this.$store.state.dashboards.settings.showWidgetTitles
                if (showTitles === undefined) {
                    return true
                }
                return showTitles
            },
            widgetTitleStyles() {
                return this.$store.getters['dashboards/widgetTitleStyles']
            }
        }
    }
</script>
