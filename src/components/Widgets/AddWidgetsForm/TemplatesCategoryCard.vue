<template>
    <div class="py-2 bg-white flex items-center cursor-pointer border-b -mx-4"
         @click="onSelectCategory">
        <div class="flex items-center justify-between w-full py-4 px-10 text-steel hover:text-primary">
            <div class="flex items-center flex-1">
                <slot name="icon">
                    <component class="w-10 h-10"
                               :is="getCategoryImage"/>
                </slot>
                <slot name="title">
                    <p class="text-main-2xl mx-6 font-medium">
                        {{ $t(CategoryName) }}
                    </p>
                </slot>
                <slot name="state-icon"/>
            </div>
            <div class="flex items-center">
                <span class="mx-2">
                    {{ get(templatesCategory, 'TemplatesList.length', 0) }}
                    {{ $t('widget.widgets') }}
                </span>
                <IconShapeMini/>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    
    export default {
        props: {
            CategoryImage: String,
            CategoryName: {
                type: String,
                default: '- -',
            },
            templatesCategory: {
                type: Object,
                default: () => ({}),
            },
        },
        methods: {
            get,
            onSelectCategory() {
                this.$emit('on-select', this.templatesCategory)
            },
        },
        computed: {
            getCategoryImage() {
                let iconName = this.CategoryImage.split('.')[0] || '' // get rid of extension
                if (iconName.length > 2) {
                    iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
                }
                return 'Icon' + iconName
            },
        },
    }
</script>
