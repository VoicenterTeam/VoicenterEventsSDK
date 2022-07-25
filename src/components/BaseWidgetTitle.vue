<template>
    <div class="min-h-8 flex items-center">
        <p
            v-if="title && showWidgetTitle"
            class="text-gray-500 font-semibold truncate"
            :class="{ 'widget-title': !customFontSize }"
            :style="customFontSize"
        >
            <slot>
                {{$t(title)}}
            </slot>
        </p>
    </div>
</template>
<script>
import get from 'lodash/get'
import { defaultFontSize } from '@/enum/defaultDashboardSettings'

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
            customFontSize () {
                const styles = this.$store.getters['layout/widgetTitleStyles'](this.getTypeOfLayout)
                const fontSize = get(styles, 'fontSize', '')
                if (!styles || fontSize === defaultFontSize) {
                    return
                }
                return {
                    fontSize
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.widget-title {
    @apply text-lg;
}
</style>
