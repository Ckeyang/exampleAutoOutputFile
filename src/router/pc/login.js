export default [
  {
    path: '/login',
    component: resolve => require(['@/views/login/Login.vue'], resolve),
    meta: { title: '登陆' }
  },
  {
    path: '/register',
    component: resolve => require(['@/views/login/register.vue'], resolve),
    meta: { title: '注册' }
  },
  {
    path: '/applyProbation',
    component: resolve => require(['@/views/login/applyProbation.vue'], resolve),
    meta: { title: '申请试用' }
  },
  {
    path: '/forgetPass',
    component: resolve => require(['@/views/login/forgetPass.vue'], resolve),
    meta: { title: '忘记密码' }
  }
]
