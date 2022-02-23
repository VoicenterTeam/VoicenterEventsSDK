<template>
    <div>
        <div class="py-2 bg-white flex items-center cursor-pointer border-b -mx-4"
             @click="onSelectCategory">
            <div class="flex items-center justify-between w-full py-4 px-10 text-steel">
                <div class="flex items-center flex-1">
                    <slot name="icon">
                        <component class="w-10 h-10 text-primary"
                                   :is="getCategoryImage"
                        />
                    </slot>
                    <div class="mx-6-5">
                        <slot name="title">
                            <p class="text-2xl font-bold text-gray-950">
                                {{ widgetGroup.WidgetGroupTitle || '-' }}
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
                        {{ getTemplatesListLength }}
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
            // await this.$store.dispatch('widgetCreation/onSelectCategory', this.templatesCategory)
            await this.$emit('widget-group-select', this.widgetGroup)
        },
    },
    computed: {
        getCategoryImage() {
            const widgetGroupImage = this.widgetGroupImage || ''
            let iconName = widgetGroupImage.split('.')[0] || '' // get rid of extension
            if (iconName.length > 2) {
                iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
            }
            return 'Icon' + (iconName || 'Settings')
        },
        getWidgetGroupListLength () {
            return get(this.widgetGroup, 'TemplatesList.length', 0)
        },
        setWidgetTranslation () {
            return this.getWidgetGroupListLength === 1 ? this.$t('widget.widget') : this.$t('widget.widgets')
        }
    },
}
</script>
