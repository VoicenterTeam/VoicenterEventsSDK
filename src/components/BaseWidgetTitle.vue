<template>
    <div class="min-h-8 flex items-center">
        <p v-if="title && showWidgetTitle" class="text-gray-700 font-semibold truncate"
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
            getTypeOfLayout () {
                return this.$store.getters['layout/getTypeOfLayout']
            },
            showWidgetTitle() {
                return this.$store.getters['layout/showWidgetTitles'](this.getTypeOfLayout)
            },
            widgetTitleStyles() {
                return this.$store.getters['layout/widgetTitleStyles'](this.getTypeOfLayout)
            }
        }
    }
</script>
