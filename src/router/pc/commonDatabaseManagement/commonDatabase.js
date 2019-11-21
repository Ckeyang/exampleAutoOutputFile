let commonDatabaseManagement = {
  path: '/configManagement',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'commonData',
      name: 'commonData',
      component: (resolve) =>
        require(['@/views/commonDatabaseManagement/list/list.vue'], resolve),
      meta: { title: '公用数据列表' }
    },
    {
      path: 'database/:id/:publicDataType',
      name: 'database',
      component: (resolve) =>
        require(['@/views/commonDatabaseManagement/protectiveEquipmentLinkage/protectiveEquipmentLinkage.vue'], resolve),
      meta: { title: '公用数据列表' }
    }
  ]
};
export default commonDatabaseManagement;
