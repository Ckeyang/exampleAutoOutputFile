export default [
  //模板编辑页面
  {
    path: '/assemblyEdit/:assmebalyId/:evaluateId/:applyingModelType',
    component: resolve =>
      require([
        '@/views/templateManagement/assemblyEdit/AssemblyWarp.vue'
      ], resolve),
    meta: { title: '组件编辑', keepAlive: true }
  },
  {
    path: '/reportTemplate/:templateId/:action/:version',
    component: resolve =>
      require(['@/views/reportTemplate/reportTemplate.vue'], resolve),
    meta: { title: '报告设置', keepAlive: true }
  },
  {
    path: '/reportOutput/:projectId/:action',
    component: resolve =>
      require(['@/views/reportTemplate/reportOutput.vue'], resolve),
    meta: { title: '报告', keepAlive: true }
  },
  {
    path: '/materialDataInput/:materialId/:action',
    component: resolve =>
      require([
        '@/views/materialManagement/materialInput/materialInput.vue'
      ], resolve),
    meta: { title: '物质录入', keepAlive: true }
  },
  {
    path: '/projectLogs/:projectId',
    component: resolve =>
      require([
        '@/views/projectManagement/projectLogs/projectLogs.vue'
      ], resolve),
    meta: { title: '项目日志', keepAlive: true }
  },
  {
    path: '/download/:projectId',
    component: resolve =>
      require(['@/views/projectManagement/download/download.vue'], resolve),
    meta: { title: '下载记录', keepAlive: true }
  },
  {
    path: '/pay',
    component: resolve =>
      require(['@/views/userManagement/pay/index.vue'], resolve),
    meta: { title: '购买中心' },
    children: [
      {
        path: 'pricePage',
        component: resolve =>
          require(['@/views/userManagement/pay/pricePage.vue'], resolve),
        meta: { title: '购买中心' }
      },
      {
        path: 'orderPage/:id',
        component: resolve =>
          require(['@/views/userManagement/pay/orderPage.vue'], resolve),
        meta: { title: '购买中心' }
      },
      {
        path: 'payPage/:orderNumber/:orderId/:price',
        component: resolve =>
          require(['@/views/userManagement/pay/pay.vue'], resolve),
        meta: { title: '购买中心' }
      }
    ]
  }
]
