export default [
  {
    path: '/template/:tempIdentifier/:tempId/:evaluateId/:applyingModelType',
    name: 'template',
    meta: { title: '模板编辑' },
    component: (resolve) => require(['@/views/template/templateWarp/TemplateWarp.vue'], resolve)
  },
  {
    path: '/printPreviewForm/:projectId',
    name: 'printPreviewForm',
    meta: { title: '表单打印' },
    component: (resolve) => require(['@/views/template/printPreview/PrintPreviewWarp.vue'], resolve)
  },
  {
    path: '/templatePreview/:tempName/:entrustNumber/:companyName/:tempId/:action/:type',
    name: 'templatePreview',
    meta: { title: '录入表单' },
    component: (resolve) => require(['@/views/template/templatePreview/templatePreview.vue'], resolve)
  },
  {
    path: '/templatePreview/:materialId/:action',
    name: 'materialTemplate',
    meta: { title: '物质录入' },
    component: (resolve) => require(['@/views/template/materialTemplate/materialTemplate.vue'], resolve)
  },
  {
    path: '/laboratorySampling/:projectId',
    component: (resolve) => require(['@/views/projectManagement/formList/laboratorySampling/laboratorySampling.vue'], resolve),
    meta: {title: '实验室收样', keepAlive: false}
  },
  {
    path: '/scanCodeEntryList/:projectId/:companyName/:entrustNumber',
    component: (resolve) => require(['@/views/projectManagement/formList/scanCodeEntry/scanCodeEntryList.vue'], resolve),
    meta: {title: '扫码录入', keepAlive: false}
  }
];
