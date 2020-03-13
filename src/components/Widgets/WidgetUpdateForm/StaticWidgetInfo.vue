<template>
    <el-popover
        placement="bottom-start"
        trigger="hover">
        <div v-if="widget.WidgetID">
            <p>{{$t('widget.id') + widget.WidgetID}}</p>
            <p>{{$t('template.name') + get(widgetTemplate, 'TemplateName') + ', ' + get(widgetTemplate, 'TemplateID')}}</p>
        </div>
        <InfoIcon slot="reference" class="text-primary cursor-help"></InfoIcon>
    </el-popover>
</template>
<script>
    import get from 'lodash/get'
    import {Popover} from 'element-ui'
    import {InfoIcon} from 'vue-feather-icons'
    import {getWidgetTemplate} from '@/helpers/widgetUtils'

    export default {
        components: {
            InfoIcon,
            [Popover.name]: Popover,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                widgetTemplate: getWidgetTemplate(this.widget)
            }
        },
        methods: {
            get,
        }
    }
</script>
