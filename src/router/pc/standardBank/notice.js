let notice = {
  path: 'standardBank',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    //公告列表
    {
      path: 'noticeList',
      name: 'noticeList',
      component: (resolve) => require(['@/views/standardBank/notice/noticeList.vue'], resolve),
      meta: { title: '公告列表', keepAlive: true }
    },
    {
      path: 'noticeEntry/:id',
      name: 'noticeEntry',
      component: (resolve) => require(['@/views/standardBank/notice/noticeEntry.vue'], resolve),
      meta: { title: '录入公告', keepAlive: true }
    },
    {
      path: 'addNoticeWordBar/:id',
      name: 'addNoticeWordBar',
      component: (resolve) => require(['@/views/standardBank/notice/addNoticeWordBar.vue'], resolve),
      meta: { title: '录入公告', keepAlive: true }
    },
    {
      path: 'noticePrompt/:id',
      name: 'noticePrompt',
      component: (resolve) => require(['@/views/standardBank/notice/noticePrompt.vue'], resolve),
      meta: { title: '公告词条', keepAlive: true }
    }
  ]
}; // 法规库
export default notice;
