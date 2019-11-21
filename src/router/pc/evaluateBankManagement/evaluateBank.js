let evaluateManagement = {
  path: 'evaluateBank',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //公告列表
    {
      path: 'evaluateList',
      name: 'evaluateList',
      component: (resolve) => require(['@/views/evaluateBank/evaluateList/evaluateList.vue'], resolve),
      meta: { title: '方法列表', keepAlive: true }
    },
    {
      path: 'evaluateDetail/:id',
      name: 'evaluateDetail',
      component: (resolve) => require(['@/views/evaluateBank/evaluateDetail/evaluateDetail.vue'], resolve),
      meta: { title: '添加方法', keepAlive: true }
    }
  ]
}; // 法规库
export default evaluateManagement;
