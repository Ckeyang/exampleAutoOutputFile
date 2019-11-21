import {
  doGet,
  doPost,
  doPut,
  doDelete
} from '../../../axiosconfig/index.js';
const projectTemplateService = {
  //----------------项目模板列表----------------
  // 查询列表
  getTemplates: (params) => doGet(`/app/templates`, params),
  // 提交审核
  submitAudit: (identifier, id, params) => doPut(`app/templates/${identifier}/${id}/submit`, params),
  // 审核模板
  auditTemplate: (identifier, id, params) => doPut(`/app/templates/${identifier}/${id}/audit`, params),
  // 启用模板
  templateEnable: (identifier, id, params) => doPut(`/app/templates/${identifier}/${id}/enable`, params),
  // 停用模板
  disenableTemplate: (identifier, id, params) => doPut(`/app/templates/${identifier}/${id}/disable`, params),
  // 添加草稿
  addTemplateDraft: (identifier, id) => doPost(`/app/templates/${identifier}/${id}/draft`),
  // 复制模板
  templateCopy: (identifier, id, params) => doPost(`/app/templates/${identifier}/${id}/copy`, params),
  // 查询修订记录
  getTemplateLogs: (identifier, params) => doGet(`/app/templates/${identifier}/logs`, params),
  // 根据类别查询项目模板
  getAllTemplatesByCategoryType: (params) => doGet(`/app/templates/sort`, params),
  //----------------设置参考数据----------------
  // 通过模板id查询模板内组件树
  findTemplateTreeByTemplateId: (id) => doGet(`app/templates/findTemplateTreeByTemplateId/${id}`),
  // 通过模板内组件id查询所有的父级控件
  findRecursiveParentComponentList: (id, params) => doGet(`app/templates/findRecursiveParentComponentList/${id}`, params),
  // 设置参考数据
  saveReferenceData: (params) => doPost(`app/templates/addReferences`, params)
};
export default projectTemplateService;