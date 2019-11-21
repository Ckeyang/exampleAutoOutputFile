let projectManagement = {
  path: 'projectManagement',
  name: 'routerWarp',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'formList/myProject',
      name: 'myProject',
      component: (resolve) => require(['@/views/projectManagement/formList/myProject.vue'], resolve),
      meta: { title: '我的项目' }
    },
    {
      path: 'formList/projectList',
      name: 'projectList',
      component: (resolve) => require(['@/views/projectManagement/formList/projectList.vue'], resolve),
      meta: { title: '全部项目' }
    },
    {
      path: 'formList/unPublish',
      name: 'unPublish',
      component: (resolve) => require(['@/views/projectManagement/formList/unPublishList.vue'], resolve),
      meta: { title: '待发布项目' }
    },
    {
      path: 'formList/noReport',
      name: 'noReport',
      component: (resolve) => require(['@/views/projectManagement/formList/ungenerate.vue'], resolve),
      meta: { title: '待生成项目' }
    },
    {
      path: 'formList/viewReport',
      name: 'viewReport',
      component: (resolve) => require(['@/views/projectManagement/formList/productProject.vue'], resolve),
      meta: { title: '已生成项目' }
    },
    {
      path: 'formList/proceed',
      name: 'proceed',
      component: (resolve) => require(['@/views/projectManagement/formList/proceedProject.vue'], resolve),
      meta: { title: '执行的项目' }
    },
    {
      path: 'formList/suspended',
      name: 'suspended',
      component: (resolve) => require(['@/views/projectManagement/formList/suspendedPorject.vue'], resolve),
      meta: { title: '暂停/终止项目' }
    },
    {
      path: 'formList/issuance',
      name: 'issuance',
      component: (resolve) => require(['@/views/projectManagement/formList/issuanceProject.vue'], resolve),
      meta: { title: '待签发项目' }
    },
    {
      path: 'formList/completed',
      name: 'completed',
      component: (resolve) => require(['@/views/projectManagement/formList/completedProject.vue'], resolve),
      meta: { title: '已完成项目' }
    },
    {
      path: 'praviteTemplateList/:projectId/:name/:state',
      name: 'praviteTemplateList',
      component: (resolve) => require(['@/views/projectManagement/formList/PraviteTemplateList.vue'], resolve),
      meta: { title: '项目模板列表', keepAlive: false }
    },
    {
      path: 'auditFormList',
      name: 'auditFormList',
      component: (resolve) => require(['@/views/projectManagement/formList/auditFormList.vue'], resolve),
      meta: { title: '项目审核', keepAlive: true }
    },
    {
      path: 'projectTemplateList',
      name: 'projectTemplateList',
      component: (resolve) => require(['@/views/projectManagement/templateList/templateList.vue'], resolve),
      meta: { title: '项目模板列表', keepAlive: true, menuId: 'projectTemplate' }
    },
    {
      path: 'dataNorm/:tempId/:name',
      name: 'dataNorm',
      component: (resolve) => require(['@/views/projectManagement/templateList/dataNorm/Index.vue'], resolve),
      meta: { title: '数据规范' }
    },
    {
      path: 'templateRules/:tempId/:tempName',
      name: 'templateRules',
      component: (resolve) => require(['@/views/projectManagement/templateList/templateRules/Index.vue'], resolve),
      meta: { title: '规则配置' }
    },
    {
      path: 'submissionAttr/:tempIdentifier/:tempId',
      name:'submissionAttr',
      component: (resolve) => require(['@/views/projectManagement/templateList/submissionAttr/Index.vue'], resolve),
      meta: { title: '设置提交属性' }
    },
    {
      path: 'referenceData/:tempId',
      name:'referenceData',
      component: (resolve) => require(['@/views/projectManagement/templateList/referenceData/Index.vue'], resolve),
      meta: { title: '设置参考数据' }
    }
  ]
};
export default projectManagement;
