import Vue from 'vue'
import App from './App'
import TreeView from "vue-json-tree-view"
Vue.config.productionTip = false
Vue.use(TreeView)
new Vue({
  // NOTE: if you need to inject as option, you can set here!
  // plugin,
  render: h => h(App)
}).$mount('#app')
