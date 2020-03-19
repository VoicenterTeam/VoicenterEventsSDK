import '../assets/css/main.scss'
import '../util/globalComponentsRequire'
import {Button, Input, Form, FormItem} from 'element-ui'
import {FadeTransition} from 'vue2-transitions'
import globalDirectives from './globalDirectives'
import RTLPlugin from './RTLPlugin'

export default {
    install(Vue) {
        // Install any plugins/components here related to the dashboard
        Vue.use(Button)
        Vue.use(Input)
        Vue.use(FormItem)
        Vue.use(Form)
        Vue.use(RTLPlugin)
        Vue.use(globalDirectives)
        Vue.component(FadeTransition.name, FadeTransition)
    }
}
