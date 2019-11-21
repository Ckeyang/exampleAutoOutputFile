let departmentManagement = {
  path: 'departmentManagement',
  component: (resolve) =>
    require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'department',
      name: 'department',
      component: (resolve) =>
        require(['@/views/departmentManagement/department/department.vue'], resolve),
      meta: { title: '机构管理' }
    }
  ]
}; // 法规库
export default departmentManagement;
