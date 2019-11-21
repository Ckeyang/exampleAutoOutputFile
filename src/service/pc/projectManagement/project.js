import {
  doGet,
  doPost,
  doPut,
  doDelete
} from '../../../axiosconfig/index.js';

let projectService = {
  /*-----------------------------项目列表和项目模板---------------------------*/
  //获取所有项目列表
  getFormList: (params) => doGet('/app/project/list', params),
  getProjectById: (id) => doGet(`/app/project/${id}/detail`),
  getProjectVersions: (id) => doGet('/app/project/' + id + '/reportTemplates/versions', {}),
  getDraftList: (params) => doGet('', params),
  deleteProject: (params) => doDelete('/app/project/myProject/' + params, ''),
  commitDrafts: (params) => doPut('', params),
  deleteDrafts: (params) => doPut('', params),
  deleteTemplate: (param1, param2) => doDelete(`/app/templates/${param1}/${param2}`, ''),
  getAuditFormList: (params) => doGet('/app/project/list/commit', params),
  //项目审核通过(后台没有做权限控制的接口)
  auditForm: (params) => doPut('/app/project/update/state', params),
  // //审核项目（权限控制接口）
  // auditProject: (params) => doPut('/app/project/update/state/audited', params),
  //创建项目
  createProject: (params) => doPost('/app/project', params),
  //我的项目修改属性
  editProject_myProject: (param1, param2) => doPut('/app/project/' + param1, param2),
  //执行中项目修改属性
  editProject_proceed: (param1, param2) => doPut('/app/project/proceed/' + param1, param2),
  //暂停项目修改属性
  editProject_suspended: (param1, param2) => doPut('/app/project/suspended/' + param1, param2),
  //发布项目
  releaseProject: (param1, params2) => doPut('app/project/publish/' + param1, params2),
  //分派任务
  assignTask_proceed: (id, params) => doPut(`/app/project/proceed/${id}/task/assign`, params),
  //分派任务
  assignTask_unpublish: (id, params) => doPut(`/app/project/${id}/task/assign`, params),
  //退回任务
  sendBackTask: (id, params) => doPut(`/app/project/proceed/${id}/task/reject`, params),
  //执行中的退回修改
  sendBackToEdit: (id, params) => doPut(`/app/project/proceed/${id}/rejected`, params),
  //待生成里面的退回修改
  sendBackToEdit_noReport: (id, params) => doPut(`/app/project/noReport/${id}/rejected`, params),
  // 取回修改
  retrieveToEdit: (id, params) => doPut(`/app/project/${id}/cancel`, params),
  //同步模板
  synchronizationProject: (params) => doGet('/app/project/template/sync/' + params),
  // 获取报告版本
  getReportVersion: (params) => doGet('/app/reports/versions', params),
  //生成报告
  generateReport: (id, params) => doPost(`/app/project/noReport/${id}/report`, params),
  //重新生成报告
  regenerateReport: (id, params) => doPost(`/app/project/reports/${id}/report`, params),
  //获取所有的评价类型
  getEvaluateList: (params) => doGet('/app/businessCategory/findCategoryTree', params),
  //增加模板
  addTemplate: (params) => doPost('/app/templates', params),
  //判断是否有未使用字段
  checkTemplate: (params) => doGet('/app/categories/evaluate', params),
  //获取模板列表
  getTemplateList: (params) => doGet('/app/templates', params),
  //获取未启用字段
  getUnusedFiled: (params) => doGet('/app/templates/' + params + '/fields/unused'),
  //修改模板属性
  editTemplateProps: (param1, param2, params3) => doPut(`/app/templates/${param1}/${param2}/properties`, params3),
  // 修改模板
  editTemplate: (param1, param2, params3) => doPut(`/app/templates/${param1}/${param2}/content`, params3),
  //根据id获取模板内容
  getTemplateById: (params) => doGet('/app/templates/' + params),
  //保存模板排序
  saveTemplateSort: (params) => doPut('/app/templates/sort', params),
  //获取项目私有模板
  getPrivateTemplateList: (param1, params2) => doGet(`/app/project/${param1}`, params2),
  // 查询可以设置提交检测数据和现场数据的组件
  findTemplateComponentSubmissionById: (id) => doGet(`/app/templates/findTemplateComponentSubmissionById/${id}`),
  // 保存设置提交检测数据和现场数据的组件
  setTemplateComponentSubmissionAttr: (identifier, id, params) => doPost(`/app/templates/${identifier}/${id}/setTemplateComponentSubmissionAttr`, params),
  getDownloadList: (id) => doGet(`/app/project/reports/${id}/downloadList`, {}),
  // 查询项目日志
  getProjectLogsById: (id, params) => doGet(`/app/project/getProjectLog/${id}`, params),

  //----------------------- 1.4项目拆分后新增的接口-------------------------
  // 获取我的项目列表
  getMyProjectList: (params) => doPost(`/app/project/list/myProjects`, params),
  // 获取所有项目列表
  getAllProjectList: (params) => doPost(`/app/project/list`, params),
  // 获取待发布项目列表
  getUnPublishProjectList: (params) => doPost(`/app/project/list/unPublish`, params),
  // 获取正在执行的项目列表
  getProceedProjectList: (params) => doPost(`/app/project/list/proceed`, params),
  // 获取暂停/终止的项目列表
  getSuspendedProjectList: (params) => doPost(`/app/project/list/suspended`, params),
  // 获取已完成的项目列表
  getCompletedProjectList: (params) => doPost(`/app/project/list/completed`, params),
  // 获取待签发的项目列表
  getIssuanceProjectList: (params) => doPost(`/app/project/list/issuance`, params),
  // 获取待生成的项目
  getFormListNoReport: (params) => doPost('/app/project/noReport/list', params),
  // 获取已生成的项目
  getFormListViewReport: (params) => doPost('/app/reports/list/viewReport', params),
  // 提交检测数据
  submitDetectData: (id) => doPost(`/app/project/proceed/${id}/detect/data`),
  // 修改校验数据内容
  changValidateFormDataStatus: (id, params) => doPut(`/app/project/${id}/changValidateFormDataStatus`, params),
  // 查询修改校验数据内容的状态
  findValidateFormDataStatus: (id) => doGet(`/app/project/${id}/findValidateFormDataStatus`),
  // 提交现场数据
  submitSiteData: (id) => doPost(`/app/project/proceed/${id}/site/data`),
  // 复核检测结果
  reviewedDetectData: (id, params) => doPut(`/app/project/proceed/${id}/detect/data/reviewed`, params),
  // 复核现场数据
  reviewedSiteData: (id, params) => doPut(`/app/project/proceed/${id}/site/data/reviewed`, params),
  // 审核项目
  auditProject: (id, params) => doPut(`/app/project/reports/${id}/audited`, params),
  // 开始执行
  startEntryProject: (id) => doPut(`/app/project/proceed/${id}/executed`),
  // 签发项目
  issuedProject: (id, params) => doPut(`/app/project/issuance/${id}/issued`, params),
  // 追回项目
  recoverProject: (id, params) => doPut(`/app/project/completed/${id}/recovered`, params),
  // 重启项目
  reopenProject: (id) => doPut(`/app/project/suspended/${id}/reopened`),
  // 启动项目
  startProject: (id) => doPut(`/app/project/suspended/${id}/started`),
  // 暂停项目
  suspendProject: (id, params) => doPut(`/app/project/suspended/${id}/suspended`, params),
  // 终止项目
  terminateProject: (id, params) => doPut(`/app/project/suspended/${id}/terminated`, params),
  // 查询退回的可选列表
  getBackStateList: (id) => doGet(`/app/project/${id}/contents`)
};
export default projectService;
