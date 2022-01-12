import get from 'lodash/get'
import '../assets/scss/main.scss'
import '../vee-validate'
import '../assets/scss/main/fonts.scss'
import RTLPlugin from './RTLPlugin'
import '../util/globalComponentsRequire'
import globalDirectives from './globalDirectives'
import Notifications from '@/components/NotificationPlugin'
import { Button, Input, Form, FormItem, Tooltip, Switch } from 'element-ui'
import { FadeTransition, CollapseTransition } from 'vue2-transitions'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
    install(Vue) {
        Vue.use(Form)
        Vue.use(Input)
        Vue.use(Button)
        Vue.use(FormItem)
        Vue.use(Tooltip)
        Vue.use(Switch)
        Vue.use(RTLPlugin)
        Vue.use(Notifications)
        Vue.use(globalDirectives)
        Vue.component(FadeTransition.name, FadeTransition)
        Vue.component(CollapseTransition.name, CollapseTransition)
        Vue.component('ValidationObserver', ValidationObserver)
        Vue.component('ValidationProvider', ValidationProvider)
        Vue.mixin({
            methods: {
                get,
            },
        })
    },
}
