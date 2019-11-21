let index = {
  path: '/index',
  component: (resolve) => require(['@/views/Index.vue'], resolve),
  meta: { title: '首页' }
};
export default index;
