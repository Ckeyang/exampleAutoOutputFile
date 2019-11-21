let basisBankManagement = {
  path: 'basisBank',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //公告列表
    {
      path: 'basisList',
      name: 'basisList',
      component: (resolve) =>
        require(['@/views/basisBank/basisList/basisList.vue'], resolve),
      meta: { title: '依据列表', keepAlive: true }
    },
    {
      path: 'basisDetail/:id',
      name: 'basisDetail',
      component: (resolve) =>
        require(['@/views/basisBank/basisDetail/basisDetail.vue'], resolve),
      meta: { title: '依据配置', keepAlive: true }
    },
    {
      path: 'checkList/:id',
      name: 'checkList',
      component: (resolve) =>
        require(['@/views/basisBank/checkList/checkList.vue'], resolve),
      meta: { title: '检查列表', keepAlive: true }
    },
    {
      path: 'checkDetail/:basisId/:id',
      name: 'checkDetail',
      component: (resolve) =>
        require(['@/views/basisBank/checkDetail/checkDetail.vue'], resolve),
      meta: { title: '检查配置', keepAlive: true }
    }
  ]
}; // 法规库
export default basisBankManagement;
