let standardBank = {
  path: 'standardBank',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //标准列表
    {
      path: 'standardList',
      name: 'standardList',
      component: (resolve) => require(['@/views/standardBank/standardList/StandardList.vue'], resolve),
      meta: { title: '标准列表', keepAlive: true }
    },
    //标准录入
    {
      path: 'standardEntry/:type/:id',
      component: (resolve) => require(['@/views/standardBank/standardEntry/StandardEntry.vue'], resolve),
      meta: { title: '录入标准', keepAlive: true }
    },
    //标准词条
    {
      path: 'standardWords/:id',
      name: 'standardWords',
      component: (resolve) => require(['@/views/standardBank/standardWords/StandardWords.vue'], resolve),
      meta: { title: '词条', keepAlive: true }
    },
    //审核标准
    {
      path: 'auditStandards/:id',
      name: 'auditStandard',
      component: (resolve) => require(['@/views/standardBank/auditStandards/AuditStandards.vue'], resolve),
      meta: { title: '审核标准', keepAlive: true }
    },
    //审核词条
    {
      path: 'auditWords/:obj',
      component: (resolve) => require(['@/views/standardBank/auditStandards/AuditWords.vue'], resolve),
      meta: { title: '审核标准', keepAlive: true }
    }
  ]
}; // 法规库
export default standardBank;
