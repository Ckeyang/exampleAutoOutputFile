import Vue from 'vue'
import Router from 'vue-router'
import test from './pc/test'
import login from './pc/login'
import home from './pc/home'
import page404 from './pc/404.js'
import template from './pc/projectManagement/template.js'
import templateEdit from './pc/templateManagement/templateEdit.js' //模板管理的模版编辑页面及预览
Vue.use(Router)
let router = new Router({
  routes: [...login, home, ...template, ...templateEdit, page404, test]
})
let special = ['/login', '/applyProbation', '/register', '/forgetPass']
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (special.includes(to.path)) {
    sessionStorage.token = ''
    next()
  } else {
    if (!sessionStorage.token) {
      new Vue().$message({
        type: 'info',
        message: '您还没有登录，请登录!'
      })
      next({
        path: '/login',
        query: {
          redirect: decodeURIComponent(to.path) // 解决路由可能进行了16进制转义
        }
      })
    } else {
      if (to.path === '/') {
        next({
          path: '/index'
        })
      } else {
        if (!to.query.cache) { // 清除缓存
          router.app.$options.store.commit({
            type: 'remoreCachesRouters',
            name: to.name
          })
          setTimeout(() => {
            next()
          }, 0)
          return
        }
        next()
      }
    }
  }
})
export default router
