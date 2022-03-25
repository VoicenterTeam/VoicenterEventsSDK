<template>
    <div class="h-20 border-b flex widget-card items-center justify-between w-full">
        <div class="flex items-center w-full pl-8">
            <div>
                <el-checkbox v-model="isChecked" />
            </div>
            <div v-if="$scopedSlots.icon || widgetIcon"
                 class="widget-icon">
                <slot name="icon">
                    <component
                        :is="widgetIcon"
                        class="mx-6 text-primary"
                    />
                </slot>
            </div>
            <div class="widget-text">
                <div class="widget-title">
                    <slot name="title">
                        <div class="flex flex-col">
                            <div class="text-xl text-gray-950 break-normal">
                                {{ widget.Title }}
                            </div>
                        </div>
                    </slot>
                </div>
                <div v-if="widget.Description || true"
                     class="widget-description">
                    <div class="text-sm text-gray-700">
                        {{ widget.Description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="mr-6-5">
            <slot name="template-preview"/>
        </div>
    </div>
</template>

<script>
import get from 'lodash/get'
import { Checkbox } from 'element-ui'

export default {
    props: {
        widget: {
            type: Object,
            default: () => {
                return {}
            },
        }
    },
    components: {
        [Checkbox.name]: Checkbox
    },
    data() {
        return {
            isChecked: false,
            defaultIcon: 'IconWidgetDefault'
        }
    },
    watch: {
        'widget.isChecked' (newV) {
            this.isChecked = newV
        },
        isChecked(newV) {
            if(Object.keys(this.widget).includes('isChecked') && newV === get(this.widget, 'isChecked', false)) {
                return
            }
            this.$emit('select-widget', this.widget.WidgetID )
        }
    },
    computed: {
        widgetIcon () {
            return get(this.widget, 'icon', this.defaultIcon)
        }
        // dashboard() {
        //     return this.$store.getters['dashboards/getActiveDashboard']
        // },
        // dashboardWidgets() {
        //     let widgets = []
        //     this.dashboard.WidgetGroupList.forEach(el => {
        //         widgets = widgets.concat(el.WidgetList)
        //     })
        //     return widgets
        // },
        // activeWidgets() {
        //     try {
        //         return this.dashboardWidgets.filter(el => el.TemplateID.toString() === this.TemplateID.toString()).length
        //     } catch (e) {
        //         console.warn(e)
        //         return 0
        //     }
        // },
    },
}
</script>

<style lang="scss" scoped>
.widget-icon {
    width: 64px;
    height: 48px;
    display: grid;
    align-items: center;
    justify-content: center;
    margin-left: 35px;
}

.widget-text {
    @apply ml-6;
    align-self: flex-start;
}
.widget-description {
    @apply mt-1;
}
</style>
