let statuteBank = {
  path: 'statuteBank',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'regulationentry',
      component: (resolve) => require(['@/views/statuteBank/regulationEntry/RegulationEntry.vue'], resolve),
      meta: { title: '录入法规', keepAlive: true }
    },
    {
      path: 'regulationEdit/:id',
      component: (resolve) => require(['@/views/statuteBank/editReglation/EditReglation.vue'], resolve),
      meta: { title: '编辑法规', keepAlive: true }
    },
    {
      path: 'regulationlist',
      name: 'regulationlist',
      component: (resolve) => require(['@/views/statuteBank/regulationList/RegulationList.vue'], resolve),
      meta: { title: '法规列表', keepAlive: true }
    },
    {
      path: 'wordbar/:id',
      name: 'wordbar',
      component: (resolve) => require(['@/views/statuteBank/wordBar/WordBar.vue'], resolve),
      meta: { title: '词条', keepAlive: true }
    },
    {
      path: 'noticeEntry',
      component: (resolve) => require(['@/views/statuteBank/noticeEntry/NoticeEntry.vue'], resolve),
      meta: { title: '录入通知', keepAlive: true }
    },
    {
      path: 'addExplain/:id/:name/:time',
      component: (resolve) => require(['@/views/statuteBank/noticeEntry/AddExplain.vue'], resolve),
      meta: { title: '关联法规', keepAlive: true }
    },
    // 审核通知
    {
      path: 'examinenotice/:id',
      component: (resolve) => require(['@/views/statuteBank/examineNotice/ExamineNotice.vue'], resolve),
      meta: { title: '审核通知', keepAlive: true }
    },
    {
      path: 'addNoticeApproval/:id/:name',
      component: (resolve) => require(['@/views/statuteBank/examineNotice/AddNoticeApproval.vue'], resolve),
      meta: { title: '审核通知', keepAlive: true }
    },
    {
      path: 'editNotice/:id',
      component: (resolve) => require(['@/views/statuteBank/editNotice/EditNotice.vue'], resolve),
      meta: { title: '编辑通知', keepAlive: true }
    },
    // 审核基础信息
    {
      path: 'examineReglation/:id',
      component: (resolve) => require(['@/views/statuteBank/examineReglation/ExamineReglation.vue'], resolve),
      meta: { title: '法规审核', keepAlive: true }
    },
    // 为每一条目添加批示
    {
      path: 'addReglationApproval/:obj',
      component: (resolve) => require(['@/views/statuteBank/examineReglation/AddReglationApproval.vue'], resolve),
      meta: { title: '法规审核', keepAlive: true }
    }
  ]
}; // 法规库
export default statuteBank;
