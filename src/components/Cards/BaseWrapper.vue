<template>
    <div :style="styles"
         v-if="widget.WidgetID"
         :ref="`wrapperContainer-${widget.WidgetID}`"
         class="w-auto h-full flex items-center rounded-lg justify-between p-4">
        <div :class="{'flex-col': isVertical}"
             class="w-full flex items-center justify-center">
            <slot name="icon">
                <component :is="cardIcon" class="min-w-16 status-icon mx-1 text-primary" :style="mainColor"/>
            </slot>
            <slot name="text">
                <el-tooltip :content="cardText" class="item" effect="dark" placement="top" v-if="showText">
                    <p :style="cardTitleStyles" class="font-bold mx-3 status-text">
                        {{cardText}}
                    </p>
                </el-tooltip>
            </slot>
            <div :class="{[$rtl.isRTL ? 'mr-auto' : 'ml-auto']: !isVertical}">
                <slot name="value">
                    <p :class="{'-my-6': isVertical}"
                       :style="cardValueStyles"
                       class="text-6xl font-bold -my-5 card-value">
                        {{cardValue}}
                    </p>
                </slot>
            </div>
            <div :class="{'edit-mode': editable}" class="absolute flex action-icons">
                <template v-if="editable">
                    <el-tooltip :content="$t('Duplicate widget')" class="item" effect="dark" placement="top">
                        <IconDuplicate @click="$emit('duplicate-widget')"
                                       class="flex cursor-pointer align-center w-6 h-8 py-2 text-blue-600"/>
                    </el-tooltip>
                    <el-tooltip :content="$t('tooltip.remove.widget')" class="item" effect="dark" placement="top">
                        <trash-icon @click="$emit('remove-item')"
                                    class="flex cursor-pointer align-center w-6 h-8 py-2 text-red trash-icon"/>
                    </el-tooltip>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="mainColor"
                                   @click="showModal"
                                   class="flex cursor-pointer align-center w-6 h-8 py-2 edit-icon text-primary"/>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-tooltip :content="$t('tooltip.edit.widget')" class="item" effect="dark" placement="top">
                        <edit-icon :style="mainColor"
                                   @click="showModal"
                                   class="flex cursor-pointer align-center w-6 h-8 py-2 edit-card-icon text-primary"/>
                    </el-tooltip>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import { EditIcon, TrashIcon } from 'vue-feather-icons'
    import { Tooltip } from 'element-ui'
    import bus from '@/event-bus/EventBus'

    export default {
        components: {
            TrashIcon,
            EditIcon,
            [Tooltip.name]: Tooltip,
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
                return get(this.styles, 'color')
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
            showModal() {
                this.$emit('show-modal')
            },
            triggerResizeEvent() {
                bus.$on('widget-resized', (widgetID) => {
                    this.checkIfCardIsVertical(widgetID)
                })
            },
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

    .action-icons {
        top: 40px;
        right: 20px;

        &.edit-mode {
            top: 0;
        }
    }
</style>
