let labelBankManagement = {
  path: 'labelBank',
  component: (resolve) =>
    require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //公告列表
    {
      path: 'labelList',
      name: 'labelList',
      component: (resolve) =>
        require([
          '@/views/labelBank/labelList/labelList.vue'
        ], resolve),
      meta: { title: '标签列表' }
    }
  ]
}; // 法规库
export default labelBankManagement;
