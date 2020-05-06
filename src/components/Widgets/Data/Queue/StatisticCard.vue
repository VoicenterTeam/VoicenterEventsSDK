<template>
    <div class="mx-1 py-1" v-if="item.layout">
        <div :style="getCardStyles"
             class="bg-white px-4 py-4 flex items-center justify-between rounded-lg shadow">
            <div class="flex flex-col w-full items-center justify-between">
                <slot name="label">
                    <div class="flex">
                        <h5 :style="getTextFontSize" class="font-bold mx-1" v-if="item.layout.showText">
                            {{$t(item.label) || item.label}}
                        </h5>
                    </div>
                </slot>
                <slot name="value">
                    <div class="flex items-center">
                        <span class="text-xl px-1" v-if="item.showAbsoluteNumbers">({{item.count}})</span>
                        <h2 :style="getValueFontSize" class="font-bold -my-2">
                            {{formatItemValue}}
                        </h2>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {EditIcon} from 'vue-feather-icons'
    import {Checkbox, Tooltip} from 'element-ui'
    import {timeFormatter} from "@/helpers/timeFormatter";
    import UpdateDialog from '@/components/Cards/UpdateDialog'
    import {AVG_RING_TIME_KEY, MAX_RING_TIME_KEY} from "@/enum/queueDashboardStatistics";

    export default {
        components: {
            [Checkbox.name]: Checkbox,
            [Tooltip.name]: Tooltip,
            UpdateDialog,
            EditIcon,
        },
        props: {
            item: {
                type: Object,
                default: () => ({})
            },
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            getTextFontSize () {
                const fontSize = get(this.widget, 'WidgetLayout.titleFontSize', '24')
                return {
                    'font-size': `${fontSize}px`
                }
            },
            getValueFontSize () {
                const fontSize = get(this.widget, 'WidgetLayout.valueFontSize', '36')
                return {
                    'font-size': `${fontSize}px`
                }
            },
            getCardStyles () {
                let item = this.item

                let styles = {
                    'color': item.colors.fonts,
                    'background': item.colors.background,
                    'min-width': `${item.layout.minWidth}px`,
                    'max-width': `${item.layout.maxWidth}px`,
                }

                if (item.layout.showBorder) {
                    styles = {
                        ...styles,
                        ...{
                            'border': `2px solid ${item.colors.frames}`,
                        }
                    }
                }
                return styles
            },
            formatItemValue () {
                if ([MAX_RING_TIME_KEY, AVG_RING_TIME_KEY].includes(this.item.key)) {
                    return timeFormatter(this.item.value)
                }
                return this.item.value
            }
        },
    }
</script>
