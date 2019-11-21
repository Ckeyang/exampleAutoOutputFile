let templateManagment = {
  path: 'template',
  component: (resolve) => require(['@/views/templateManagement/TemplateManagement.vue'], resolve),
  // children: [
  //   //模板管理
  //   {
  //     path: 'templateList',
  //     component: (resolve) => require(['@/views/templateManagement/templateList/TemplateList.vue'], resolve),
  //     meta: { title: '模板列表', keepAlive: true, menuId: 'publicTemplate' } //  menuId 为该路由的标识，用于判断是否刷新此页面
  //   }
  // ]
};
export default templateManagment;
