<template>
    <div :style="styles"
         v-if="widget.WidgetID"
         :ref="`wrapperContainer-${widget.WidgetID}`"
         class="w-auto h-full flex items-end rounded-lg justify-between p-4">
        <div :class="{'flex-col': isVertical}"
             class="w-full flex items-center justify-center relative">
            <div :class="{[$rtl.isRTL ? 'ml-auto' : 'mr-auto']: !isVertical}">
                <slot name="value">
                    <p :class="{'-my-6': isVertical}"
                       :style="cardValueStyles"
                       class="text-6xl font-bold card-value">
                        {{ cardValue }}
                    </p>
                </slot>
            </div>
        </div>
        <div class="absolute card-action_wrapper rounded">
            <div class="flex items-center pl-6 pt-8">
                <slot name="icon">
                    <component :is="cardIcon" class="min-w-12 status-icon mx-1 text-primary" :style="mainColor"/>
                </slot>
                <slot name="text">
                    <el-tooltip :content="cardText" class="item" effect="dark" placement="top" v-if="showText">
                        <p :style="cardTitleStyles" class="font-bold mx-3 status-text">
                            {{ cardText }}
                        </p>
                    </el-tooltip>
                </slot>
            </div>
            <div class="flex pt-1">
                <span class="px-2" @click="onInfoClick">
                <i class="vc-icon-info icon-lg text-gray-700 cursor-help hover:text-primary"/>
            </span>
                <CardAction :editable="editable"
                            v-on="$listeners"
                            :main-color="mainColor"/>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import bus from '@/event-bus/EventBus'
    import CardAction from '@/components/Cards/CardAction'
    
    export default {
        components: {
            CardAction,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            showText: {
                type: Boolean,
                default: false,
            },
            cardIcon: {
                type: String,
                default: '',
            },
            cardText: {
                type: String,
                default: '',
            },
            cardValue: {
                type: [String, Number],
                default: '',
            },
            styles: {
                type: Object,
                default: () => ({}),
            },
            layoutConfig: {
                type: Object,
                default: () => ({}),
            },
            widget: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                isVertical: false,
            }
        },
        computed: {
            mainColor() {
                return get(this.styles, 'color', {})
            },
            cardTitleStyles() {
                return {
                    ...this.mainColor,
                    fontSize: this.styles.titleFontSize,
                }
            },
            cardValueStyles() {
                return {
                    ...this.mainColor,
                    fontSize: this.styles.valueFontSize,
                }
            },
        },
        methods: {
            checkIfCardIsVertical(WidgetID) {
                let wrapper = this.$refs[`wrapperContainer-${WidgetID}`]
                if (!wrapper) {
                    return
                }
                this.isVertical = wrapper.clientWidth < 280
            },
            triggerResizeEvent() {
                bus.$on('widget-resized', (widgetID) => {
                    this.checkIfCardIsVertical(widgetID)
                })
            },
            onInfoClick() {
                this.$emit('on-show-info')
            }
        },
        mounted() {
            this.triggerResizeEvent()
        },
        watch: {
            widget: {
                deep: true,
                immediate: true,
                handler(widget) {
                    this.$nextTick(() => {
                        this.checkIfCardIsVertical(widget.WidgetID)
                    })
                },
            },
        },
    }
</script>
<style lang="scss" scoped>
.status-icon {
    max-width: 64px;
}
.card-action_wrapper {
    top: 10px;
    right: 10px;

    @apply flex w-full justify-between;
    
    &.edit-mode {
        top: 0;
        right: 0px;
    }
}
</style>
