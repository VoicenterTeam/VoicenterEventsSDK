import clickOutside from '@/directives/click-ouside.js'
import ellipsisCheck from '@/directives/ellipsis-check'
import { Loading } from 'element-ui';
/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install (Vue) {
    Vue.directive('click-outside', clickOutside),
    Vue.directive('ellipsis-check', ellipsisCheck),
    Vue.use(Loading)
  }
}

export default GlobalDirectives
