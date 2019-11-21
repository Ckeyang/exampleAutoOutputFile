let test = {
  path: '/test',
  component: (resolve) => require(['@/views/Test/Test.vue'], resolve),
  meta: {
    title: '测试'
  }
};
export default test;
