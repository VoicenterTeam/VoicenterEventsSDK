import get from 'lodash/get'
import '../assets/css/main.scss'
import '../assets/css/fonts.scss'
import RTLPlugin from './RTLPlugin'
import '../util/globalComponentsRequire'
import globalDirectives from './globalDirectives'
import Notifications from '@/components/NotificationPlugin'
import { Button, Input, Form, FormItem, Tooltip } from 'element-ui'
import { FadeTransition, CollapseTransition } from 'vue2-transitions'

export default {
    install(Vue) {
        Vue.use(Form)
        Vue.use(Input)
        Vue.use(Button)
        Vue.use(FormItem)
        Vue.use(Tooltip)
        Vue.use(RTLPlugin)
        Vue.use(Notifications)
        Vue.use(globalDirectives)
        Vue.component(FadeTransition.name, FadeTransition)
        Vue.component(CollapseTransition.name, CollapseTransition)
        Vue.mixin({
            methods: {
                get,
            },
        })
    },
}
