<template>
    <div>
        <portal to="redirect-action">
            <span class="text-steel hover:text-primary redirect-action"
                  @click="goToSelectedCategory()">
                  <IconDirLeft class="mx-1"/>
                  {{ $t(templateCategory.CategoryName) }}
            </span>
        </portal>
        <portal to="form-title">
            {{ getTemplate.TemplateName }}
        </portal>
        <div class="grid grid-cols-7 col-gap-4 template-preview -mx-4-5"
             v-loading="loading">
            <div class="col-span-5 bg-gray-150">
                <div class="flex items-center justify-center h-full">
                    <div class="w-64 my-20 rounded p-2 relative">
                        <div v-for="item in templateHelp.Items">
                            <div class="absolute z-50 cursor-help"
                                 :style="getStyle(item)">
                                <div class="ellipse-wrapper flex items-center justify-center"
                                     @mouseover="onEllipseMouseOver(item.ItemNumber)"
                                     @mouseleave="onEllipseMouseLeave()">
                                    <div
                                        class="ellipse-outer bg-primary-300 text-white flex items-center justify-center">
                                        <div class="ellipse-inner text-white flex items-center justify-center">
                                            <span>{{ item.ItemNumber }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <component :is="templateHelp.WidgetHelpPicture"
                                   class="w-64 h-48"
                        />
                    </div>
                </div>
            </div>
            <div class="col-span-2 px-2">
                <div v-for="item in templateHelp.Items">
                    <p class="text-gray-800 my-2">{{ item.ItemName }}</p>
                    <div class="flex break-normal p-1"
                         :class="{'bg-primary-100 rounded': item.ItemNumber === activeItemNumber}">
                        <b>{{ item.ItemNumber }}</b>.
                        <span class="mx-1 text-xs">{{ item.ItemDescription }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    
    const ONE_REM_IN_PX = 16
    
    export default {
        props: {
            template: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            getTemplate() {
                return this.$store.getters['widgetCreation/getTemplateToPreview']
            },
            templateCategory() {
                return this.$store.getters['widgetCreation/getCategoryTemplates']
            },
        },
        data() {
            return {
                loading: false,
                activeItemNumber: 0,
                templateHelp: {
                    WidgetName: 'Table - User Preformance',
                    WidgetTitle: 'Table - User Preformance',
                    WidgetUsage: 'To track each user and it overall data and performance, including calls, breaks, and much more.',
                    WidgetDescription: 'Shows overall performance and data per user, in a table view.',
                    WidgetHelpPicture: 'IconThelpCounter',
                    WidgetTemplateHelpID: 2,
                    Items: [
                        {
                            ItemDescription: 'place holder text we will change it',
                            ItemIcon: 'Default',
                            ItemName: 'User:',
                            ItemNumber: 1,
                            ItemPositionX: 1,
                            ItemPositionY: 1,
                            WidgetTemplateHelpID: 7,
                            WidgetTemplateHelpItemID: 1,
                        }, {
                            ItemDescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dolorum eaque earum facilis in nostrum perspiciatis qui quia repellendus rerum.',
                            ItemIcon: 'Default',
                            ItemName: 'User:',
                            ItemNumber: 2,
                            ItemPositionX: 12.5,
                            ItemPositionY: 1.4,
                            WidgetTemplateHelpID: 7,
                            WidgetTemplateHelpItemID: 2,
                        }, {
                            ItemDescription: 'place holder text we will change it',
                            ItemIcon: 'Default',
                            ItemName: 'Hold Percentage:',
                            ItemNumber: 3,
                            ItemPositionX: 2,
                            ItemPositionY: 6.5,
                            WidgetTemplateHelpID: 7,
                            WidgetTemplateHelpItemID: 3,
                        },
                    ],
                },
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
                const helpData = this.$store.getters['templatesCategory/getHelpByWidgetsTemplateID'](this.template.TemplateID)
                this.templateHelp = get(helpData, 'Help.Items', [])
            },
        },
        mounted() {
            //this.getHelpByWidgetsTemplateID()
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
</style>
