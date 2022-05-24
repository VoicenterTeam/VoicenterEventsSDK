<template>
    <div
        :style="styles"
        v-if="widget.WidgetID"
        :ref="`wrapperContainer-${widget.WidgetID}`"
        class="items-center flex rounded-lg justify-center p-4 border-gray-700 min-h-full"
    >
        <div class="flex w-full justify-end flex-row absolute top-4 action-container">
            <span v-if="showInfoButton" class="px-2" @click="onInfoClick">
                <i class="vc-icon-info icon-lg text-gray-700 cursor-help hover:text-primary"/>
            </span>
            <CardAction
                :editable="editable"
                v-on="$listeners"
                :main-color="mainColor"
            />
        </div>
        <div class="card-action_wrapper rounded min-h-full">
            <div class="p-2">
                <slot name="icon">
                    <component :is="cardIcon" class="status-icon text-primary" :style="cardValueIconStyles"/>
                </slot>
            </div>
            <div class="p-2">
                <slot name="text">
                    <p :style="cardTitleStyles" class="font-bold status-text">
                        {{ cardText }}
                    </p>
                </slot>
            </div>
            <div
                class="p-2"
            >
                <div>
                    <slot name="value">
                        <p
                            class="font-bold card-value"
                            :style="cardValueStyles"
                        >
                            {{ cardValue }}
                        </p>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    
    export default {
        components: {
            CardAction: () => import('@/components/Cards/CardAction')
        },
        props: {
            editable: {
                type: Boolean,
                default: false
            },
            showText: {
                type: Boolean,
                default: false
            },
            cardIcon: {
                type: String,
                default: ''
            },
            cardText: {
                type: String,
                default: ''
            },
            cardValue: {
                type: [String, Number],
                default: ''
            },
            styles: {
                type: Object,
                default: () => ({})
            },
            layoutConfig: {
                type: Object,
                default: () => ({})
            },
            widget: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                isVertical: false,
                templateHelp: {}
            }
        },
        computed: {
            mainColor() {
                return get(this.styles, 'color', {})
            },
            cardTitleStyles() {
                return {
                    ...this.mainColor,
                    fontSize: this.styles.titleFontSize
                }
            },
            cardValueStyles() {
                return {
                    ...this.mainColor,
                    fontSize: this.styles.valueFontSize
                }
            },
            showInfoButton() {
                return get(this.templateHelp, "Items", []).length > 0
            },
            cardValueIconStyles() {
                return {
                    ...this.mainColor,
                    minWidth: this.styles.valueIconMinWidth
                }
            }
        },
        methods: {
            onInfoClick() {
                this.$emit('on-show-info')
            },
            getHelpByWidgetsTemplateID() {
                const templateId = get(this.widget, "TemplateID")
                if (!templateId) {
                    this.templateHelp = {}
                    return
                }

                const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](templateId)
                this.templateHelp = get(helpData, 'Help', {})
            },
        },
        mounted() {
            this.getHelpByWidgetsTemplateID()
        }
    }
</script>
<style lang="scss" scoped>
.card-action_wrapper {
    @apply flex items-center justify-center flex-wrap;
    
    &.edit-mode {
        top: 0;
        right: 0px;
    }
}
[dir="ltr"] .action-container {
    @apply right-2;
}
[dir="rtl"] .action-container {
    @apply left-2;
}
</style>
