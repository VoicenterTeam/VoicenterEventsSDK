<template>
    <div>
        <portal to="redirect-action">
            <span
                class="text-primary redirect-action"
                @click="goToSelectedCategory()"
            >
                <IconDirLeft class="mx-1"/>
                {{ $t(templateCategory.CategoryName) }}
            </span>
        </portal>
        <portal to="form-title">
            {{ getTemplate.template.TemplateName }}
        </portal>
        <portal to="additional-action">
            <span 
                class="mr-2"
            >
                <el-button
                    @click="addWidgetToCategory(getTemplate.template)"
                    type="_primary"
                    class="button-add-all"
                    v-if="!isWidgetAdded && !hideBtn"
                >
                    <div class="flex items-center">
                        <IconAdd :class="$rtl.isRTL ? 'ml-1' : 'mr-1'"/>
                        <span
                            class="text-sm"
                        >
                            {{ $t('Add Widget') }}
                        </span>
                    </div>
                </el-button>
            </span>
        </portal>
        <div class="grid grid-cols-7 gap-4 template-preview -mx-4-5"
            v-loading="loading">
            <div class="col-span-5 bg-gray-150">
                <div class="flex items-center justify-center h-full">
                    <div class="w-64 my-20 rounded p-2 relative">
                        <div v-for="(item, index) in templateHelp.Items" :key="index">
                            <div class="absolute z-50 cursor-help"
                                 :style="getStyle(item)">
                                <div class="ellipse-wrapper flex items-center justify-center"
                                    @mouseover="onEllipseMouseOver(item.ItemNumber)"
                                    @mouseleave="onEllipseMouseLeave()"
                                >
                                    <div
                                        class="ellipse-outer bg-primary-300 text-white flex items-center justify-center">
                                        <div class="ellipse-inner text-white flex items-center justify-center">
                                            <span>{{ item.ItemNumber }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <component
                            :is="templateHelp.WidgetHelpPicture"
                            class="w-64 h-48"
                        />
                    </div>
                </div>
            </div>
            <div class="col-span-2 px-2 overflow-auto max-h-65vh">
                <div v-for="(item, index) in templateHelp.Items" :key="index">
                    <p class="text-gray-800 my-2">{{ item.ItemName }}</p>
                    <div class="flex break-normal p-1"
                         :class="{'bg-primary-100 rounded': item.ItemNumber === activeItemNumber}">
                        <b>{{ item.ItemNumber }}</b>.
                        <span class="mx-1 text-xs">{{ item.ItemDescription }}</span>
                    </div>
                </div>
            </div>
        </div>
        <portal to="form-footer">
            <div class="px-10" v-if="!isWidgetAdded">
                <el-button @click="finish"
                    class="font-bold btn-finish"
                    type="primary">
                    {{ $t('Finish') }}
                </el-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import get from 'lodash/get'

    const ONE_REM_IN_PX = 16

    export default {
        computed: {
            getTemplate() {
                return this.$store.getters['widgetCreation/getTemplateToPreview']
            },
            templateCategory() {
                return this.$store.getters['widgetCreation/getCategoryTemplates']
            },
            isWidgetAdded () {
                const activeWidget = this.templateCategory.TemplatesList.find(el => Number(el.TemplateID) === Number(this.getTemplate.template.TemplateID))
                return activeWidget.quantity
            }
        },
        data() {
            return {
                loading: false,
                activeItemNumber: 0,
                templateHelp: {},
                hideBtn: false
            }
        },
        methods: {
            async goToSelectedCategory() {
                await this.$store.dispatch('widgetCreation/goToCategory')
            },
            getStyle(item) {
                return {
                    'margin-top': +item.ItemPositionY * ONE_REM_IN_PX + 'px',
                    'margin-left': +item.ItemPositionX * ONE_REM_IN_PX + 'px',
                }
            },
            onEllipseMouseOver(index) {
                this.activeItemNumber = index
            },
            onEllipseMouseLeave() {
                this.activeItemNumber = 0
            },
            getHelpByWidgetsTemplateID() {
                const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](this.getTemplate.template.TemplateID)

                this.templateHelp = get(helpData, 'Help', {})
            },
            addWidgetToCategory () {
                this.hideBtn = true
            },
            async finish () {
                if (this.hideBtn) {
                   this.$set(this.getTemplate.template, 'quantity', 1)
                   await this.goToSelectedCategory()
                }
            }
        },
        mounted() {
            this.getHelpByWidgetsTemplateID()
        },
    }
</script>
<style lang="scss" scoped>
.template-preview ::v-deep {
    .ellipse-wrapper {
        @apply w-9 h-9 rounded-full bg-primary-100;
        content: '';

        span {
            @apply hidden;
        }

        &:hover {
            span {
                @apply flex;
            }

            .ellipse-outer {
                @apply bg-primary;
            }
        }
    }

    .ellipse-outer {
        @apply w-5 h-5 rounded-full;
        content: '';
    }

    .ellipse-inner {
        @apply w-3 h-3 rounded-full bg-primary;
        content: '';
    }
}
.button-add-all {
    @apply px-5 py-1;
}
.btn-finish {
    @apply text-base px-10 py-1.5;
}
</style>
