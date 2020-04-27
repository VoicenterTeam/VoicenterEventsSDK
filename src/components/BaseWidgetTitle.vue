<template>
    <div class="h-8">
        <p v-if="title && showWidgetTitle" class="text-main-2xl font-semibold"
           :style="$store.getters['dashboards/widgetTitleStyles']">
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
            }
        }
    }
</script>
<style>
</style>
