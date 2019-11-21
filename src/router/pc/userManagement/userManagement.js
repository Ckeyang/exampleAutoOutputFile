let userManagement = {
  path: 'userManagement',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //角色管理
    {
      path: 'rool',
      name: 'rool',
      component: (resolve) => require(['@/views/userManagement/role/role.vue'], resolve),
      meta: { title: '角色管理', keepAlive: true }
    },
    {
      path: 'jurisdiction',
      name: 'jurisdiction',
      component: (resolve) => require(['@/views/userManagement/jurisdiction/jurisdiction.vue'], resolve),
      meta: { title: '权限管理', keepAlive: true }
    },
    {
      path: 'user',
      name: 'user',
      component: (resolve) => require(['@/views/userManagement/user/index.vue'], resolve),
      meta: { title: '用户管理', keepAlive: true }
    },
    {
      path: 'account',
      name: 'account',
      component: (resolve) => require(['@/views/userManagement/account/index.vue'], resolve),
      meta: { title: '账户管理', keepAlive: true }
    },
    {
      path: 'order',
      name: 'order',
      component: (resolve) => require(['@/views/userManagement/order/index.vue'], resolve),
      meta: { title: '订单管理' }
    },
    {
      path: 'invoice',
      name: 'invoice',
      component: (resolve) => require(['@/views/userManagement/invoice/index.vue'], resolve),
      meta: { title: '发票管理' }
    },
    {
      path: 'customNumber',
      name: 'customNumber',
      component: (resolve) => require(['@/views/userManagement/customNumber/customNumber.vue'], resolve),
      meta: { title: '自定义编号', keepAlive: true }
    },
    {
      path: 'sharedParts',
      name: 'sharedParts',
      component: (resolve) => require(['@/views/sharedParts/list/list.vue'], resolve),
      meta: { title: '共享件管理', keepAlive: true }
    },
    {
      path: 'takeExample',
      name: 'takeExample',
      component: (resolve) => require(['@/views/userManagement/takeExample/takeExample.vue'], resolve),
      meta: { title: '采样方法', keepAlive: true }
    },
    // {
    //   path: 'advisoryCategory',
    //   component: (resolve) => require(['@/views/advisoryCategory/index.vue'], resolve),
    //   meta: { title: '咨询类别管理', keepAlive: true }
    // },
    // {
    //   path: 'detectCategories',
    //   component: (resolve) => require(['@/views/detectCategories/index.vue'], resolve),
    //   meta: { title: '检测类别管理', keepAlive: true }
    // },
    {
      path: 'deviceList',
      component: (resolve) => require(['@/views/deviceManagement/index.vue'], resolve),
      meta: { title: '设备管理', keepAlive: true }
    },
    {
      path: 'parameter',
      component: (resolve) => require(['@/views/parameter/index.vue'], resolve),
      meta: { title: '参数管理' },
      children: [
        {
          path: 'parameterList',
          component: (resolve) => require(['@/views/parameter/parameterList/index.vue'], resolve),
          meta: { title: '参数管理' }
        },
        {
          path: 'restrictiveRules',
          component: (resolve) => require(['@/views/parameter/restrictiveRules/index.vue'], resolve),
          meta: { title: '参数管理' }
        },
        {
          path: 'diathesisList',
          component: (resolve) => require(['@/views/parameter/diathesisList/index.vue'], resolve),
          meta: { title: '参数管理' }
        }
      ]
    },
    {
      path: 'test',
      component: (resolve) => require(['@/views/TEXT.vue'], resolve),
      meta: { title: '测试页面', keepAlive: false }
    }
  ]
}; // 法规库
export default userManagement;
