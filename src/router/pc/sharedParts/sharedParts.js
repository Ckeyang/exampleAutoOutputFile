let sharedParts = {
  path: 'sharedParts',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'list',
      name: 'sharedPartsList',
      component: (resolve) => require(['@/views/sharedParts/list/list.vue'], resolve),
      meta: { title: '共享件管理' }
    }
  ]
};
export default sharedParts;
