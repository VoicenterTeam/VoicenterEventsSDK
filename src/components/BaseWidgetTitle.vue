<template>
    <div class="min-h-8 flex items-center">
        <p v-if="title && showWidgetTitle" class="text-gray-500 font-semibold truncate widget-title">
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
            }
        }
    }
</script>

<style lang="scss" scoped>
.widget-title {
    @apply text-lg;
}
</style>
