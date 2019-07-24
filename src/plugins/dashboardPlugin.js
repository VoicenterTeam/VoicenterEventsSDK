import '../assets/css/main.scss'
import '../util/globalComponentsRequire'
import {Button, Input, Form, FormItem} from 'element-ui'
import {FadeTransition} from 'vue2-transitions'
import globalDirectives from './globalDirectives'
import RTLPlugin from './RTLPlugin'

// element ui language configuration
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

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
