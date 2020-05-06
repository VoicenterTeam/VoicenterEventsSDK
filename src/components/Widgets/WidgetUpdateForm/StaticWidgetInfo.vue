<template>
    <div class="flex">
        <el-popover
            placement="bottom-start"
            trigger="hover">
            <div v-if="widget.WidgetID">
                <p>{{$t('widget.id') + widget.WidgetID}}</p>
                <p>{{$t('template.name') + getTemplateName + ', ' + getTemplateID}}</p>
            </div>
            <InfoIcon class="text-primary cursor-help" slot="reference"></InfoIcon>
        </el-popover>
        <el-popover
            class="mx-1"
            placement="bottom-start"
            trigger="hover"
            v-if="permissionsBlocked.length">
            <div v-html="getPermissionsBlockedIds"/>
            <AlertTriangleIcon class="text-orange-400 cursor-help" slot="reference"></AlertTriangleIcon>
        </el-popover>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Popover} from 'element-ui'
    import {AlertTriangleIcon, InfoIcon} from 'vue-feather-icons'
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
            widgetTemplate () {
                return getWidgetTemplate(this.widget)
            },
            getTemplateName () {
                return get(this.widgetTemplate, 'TemplateName', '--')
            },
            getTemplateID () {
                return get(this.widgetTemplate, 'TemplateID', '--')
            },
            permissionsBlocked () {
                return get(this.widget, 'WidgetLayout.PermissionsBlocked', [])
            },
            getPermissionsBlockedIds () {
                const permissionsBlocked = this.permissionsBlocked.join(', ')
                return `${this.$t('This widget is displaying a partial list because of permissions issues.')} <br> ${this.$t('The following IDs were not displayed are')}: <b>${permissionsBlocked}</b>`
            }
        },
    }
</script>
