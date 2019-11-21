// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import api from './service/index.js'
import store from './store/Store.vue' //使用vuex
import mathJax from '../static/js/MathJax.js'
import { extendArray, formatMoney } from './utils.js'
//-------------------ElementUI--------------
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as directives from './directive/index.js'
import * as filters from './filters/index.js'
import confirm from './plugins/confirm/index.js'
import alert from './plugins/alert/index.js'
// minxins
import minxins from './mixins/winHeight'
import infiniteScroll from 'vue-infinite-scroll'
// vxe-table
import './plugins/vxe-table/XEUtils'
import './plugins/vxe-table/xtable'

import './websocket/socketService'

Vue.mixin(minxins)
extendArray() // 扩展数组方法
formatMoney() // 扩展Number方法
// filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 自定义指令
Object.keys(directives).forEach(key => {
  if (key === 'drag') {
    Vue.directive('el-drag-dialog', directives[key]) //弹框拖动
  } else {
    Vue.directive(key, directives[key])
  }
})
// 自定义插件
Vue.use(ElementUI)
Vue.use(confirm)
Vue.use(alert)
Vue.use(infiniteScroll)
Vue.prototype.$http = api
Vue.prototype.$mathJax = mathJax
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  minxins,
  components: {
    App
  },
  template: '<App/>'
})
