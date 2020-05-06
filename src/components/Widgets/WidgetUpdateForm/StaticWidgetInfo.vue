<template>
    <div class="flex">
    <el-popover
        placement="bottom-start"
        trigger="hover">
        <div v-if="widget.WidgetID">
            <p>{{$t('widget.id') + widget.WidgetID}}</p>
            <p>{{$t('template.name') + getTemplateName + ', ' + getTemplateID}}</p>
        </div>
        <InfoIcon slot="reference" class="text-primary cursor-help"></InfoIcon>
    </el-popover>
        <el-popover
            v-if="permissionsBlocked.length"
            class="mx-1"
            placement="bottom-start"
            trigger="hover">
            <div v-html="getPermissionsBlockedIds"/>
            <AlertTriangleIcon slot="reference" class="text-orange-400 cursor-help"></AlertTriangleIcon>
        </el-popover>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Popover} from 'element-ui'
    import {InfoIcon, AlertTriangleIcon} from 'vue-feather-icons'
    import {getWidgetTemplate} from '@/helpers/widgetUtils'

    export default {
        components: {
            InfoIcon,
            AlertTriangleIcon,
            [Popover.name]: Popover,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            widgetTemplate() {
                return getWidgetTemplate(this.widget)
            },
            getTemplateName() {
                return get(this.widgetTemplate, 'TemplateName', '--')
            },
            getTemplateID() {
                return get(this.widgetTemplate, 'TemplateID', '--')
            },
            permissionsBlocked() {
                return get(this.widget, 'WidgetLayout.PermissionsBlocked', [])
            },
            getPermissionsBlockedIds() {
                const permissionsBlocked = this.permissionsBlocked.join(', ')
                return `${this.$t('This widget is displaying a partial list because of permissions issues.')} <br> ${this.$t('The following IDs were not displayed are')}: <b>${permissionsBlocked}</b>`
            }
        },
    }
</script>
