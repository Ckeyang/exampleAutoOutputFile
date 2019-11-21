let material = {
  path: 'substanceManagement',
  component: (resolve) =>
    require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'substanceList',
      name: 'substanceList',
      meta: { title: '物质列表' },
      component: (resolve) =>
        require([
          '@/views/materialManagement/materialListTwo/materialList.vue'
        ], resolve)
    },
    {
      path: 'substanceTemplateList',
      name: 'substanceTemplateList',
      meta: { title: '物质模板' },
      component: (resolve) =>
        require(['@/views/materialManagement/template/material.vue'], resolve)
    }
  ]
};
export default material;
