let page404 = {
  path: '*',
  name: '404',
  component: (resolve) => require(['@/views/404/404.vue'], resolve)
  //   meta: { title: 404 }
};
export default page404;
