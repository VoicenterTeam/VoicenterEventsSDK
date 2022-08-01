<template>
    <div>
        <div
            class="py-2 bg-white flex items-center border-b"
            @click="onSelectCategory"
            :class="{ 'opacity-25 cursor-not-allowed': !getWidgetsListLength, 'cursor-pointer': getWidgetsListLength }"
        >
            <div class="flex items-center justify-between w-full py-4 px-2.5 text-steel">
                <div class="flex items-center flex-1">
                    <div>
                        <slot name="title">
                            <p class="text-2xl font-bold text-gray-950">
                                {{ widgetGroupTitle }}
                            </p>
                        </slot>
                        <slot name="description">
                            <p class="text-xs font-normal text-gray-950 mt-2">
                                {{ $t(widgetGroupDescription) }}
                            </p>
                        </slot>
                    </div>
                    <slot name="state-icon"/>
                </div>
                <div class="flex items-center text-primary">
                    <span class="mx-3 font-bold text-base">
                        {{ getWidgetsListLength }}
                        {{ setWidgetTranslation }}
                    </span>
                    <IconShapeMini/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import get from 'lodash/get'

export default {
    props: {
        widgetGroupImage: String,
        widgetGroupName: {
            type: String,
            default: '- -'
        },
        widgetGroup: {
            type: Object,
            default: () => ({})
        },
        widgetGroupDescription: {
            type: String,
            default: ''
        }
    },
    methods: {
        get,
        async onSelectCategory() {
            if (!this.getWidgetsListLength) {
                return
            }
            await this.$emit('widget-group-select', this.widgetGroup)
        }
    },
    computed: {
        widgetGroupTitle() {
            return this.widgetGroup.WidgetGroupTitle || this.$t('dashboard.groupID') + `: ${this.widgetGroup.WidgetGroupID}`
        },
        getWidgetsListLength () {
            return get(this.widgetGroup, 'WidgetList.length', 0)
        },
        setWidgetTranslation () {
            return this.getWidgetsListLength === 1 ? this.$t('widget.widget') : this.$t('widget.widgets')
        }
    }
}
</script>
