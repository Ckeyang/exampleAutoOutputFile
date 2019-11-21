let reportManagement = {
  path: 'reportTemplateManagement',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'list/:action',
      name: 'reportList',
      component: (resolve) => require(['@/views/reportManagement/reportList/reportList.vue'], resolve),
      meta: { title: '报告模板' }
    },
    {
      path: 'relation',
      name: 'relation',
      component: (resolve) => require(['@/views/reportManagement/relationProject/relationProject.vue'], resolve),
      meta: { title: '版本关联' }
    }
  ]
};
export default reportManagement;
