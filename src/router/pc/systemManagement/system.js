let parameterManagement = {
  path: 'parameterManagement',
  component: (resolve) => require(['@/views/routerWarp/routerWarp.vue'], resolve),
  children: [
    {
      path: 'samplingMethod',
      name: 'samplingMethod',
      component: (resolve) => require(['@/views/userManagement/takeExample/takeExample.vue'], resolve),
      meta: { title: '采样方式' }
    },
    {
      path: 'formula',
      name: 'formula',
      component: (resolve) => require(['@/views/userManagement/formula/formula.vue'], resolve),
      meta: { title: '公式列表' }
    },
    {
      path: 'evaluationCategory',
      name: 'evaluationCategory',
      component: (resolve) => require(['@/views/evaluationCategoryManagement/index.vue'], resolve),
      meta: { title: '业务类别管理' }
    },
    {
      path: 'deviceParameters',
      name: 'deviceParameters',
      component: (resolve) => require(['@/views/deviceManagement/index.vue'], resolve),
      meta: { title: '设备列表' }
    },
    {
      path: 'parameterList',
      name: 'parameterList',
      component: (resolve) => require(['@/views/parameter/parameterList/index.vue'], resolve),
      meta: { title: '参数管理' }
    },
    {
      path: 'limitRegulation',
      name: 'limitRegulation',
      component: (resolve) => require(['@/views/parameter/restrictiveRules/index.vue'], resolve),
      meta: { title: '限值规定' }
    },
    {
      path: 'limitRegulationForm/:limitValueCategory/:evaluationCategory/:name',
      name: 'limitRegulationForm',
      component: (resolve) => require(['@/views/parameter/restrictiveRules/restrictiveForm.vue'], resolve),
      meta: { title: '限值规定表' }
    },
    {
      path: 'substanceFactor',
      name: 'substanceFactor',
      component: (resolve) => require(['@/views/parameter/diathesisList/index.vue'], resolve),
      meta: { title: '物质因素列表' }
    }
  ]
};
export default parameterManagement;
