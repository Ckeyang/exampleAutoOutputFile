import { doGet, doPost, doPut, doDelete } from '../../../axiosconfig/index';

let reportService = {
  getReportTemplateList: (params) => doGet('/app/report/templates', params),
  getCategoryTree: () => doGet('/app/businessCategory/findCategoryTree', {}),
  getCategoryNotIncluded: () => doGet('/app/substance/category/findAllNotIncluded', {}),
  getAllTemplateList: (params) => doGet(`/app/report/templates/quote/list`, params),
  getReportTemplateListPublish: (params) =>
    doGet('/app/report/templates/publish', params),
  getReportTemplateListAudit: (params) =>
    doGet('/app/report/templates/audit', params),
  getReportTemplateListDraft: (params) =>
    doGet('/app/report/templates/draft', params),
  reviceReport: (identifier, id, params) => doPut(`/app/report/templates/${identifier}/${id}`, params),
  copyReportTemplate: (id) =>
    doPut('/app/report/templates/' + id + '/copy', {}),
  saveReportTempalte: (id, params) =>
    doPut('/app/report/templates/' + id + '/save', params),
  importReportDoc: (params) =>
    doPost('/app/report/templates/importReport', params),
  deleteField: (id) => doDelete('/app/report/template/field/', id),
  createField: (params) => doPost('/app/report/template/field', params),
  updateField: (id, params) =>
    doPut('/app/report/template/field/' + id, params),
  deleteParagra: (id) => doDelete('/app/report/templates/deleteDirectory/', id),
  createParagra: (params) =>
    doPost('/app/report/templates/createDirectory', params),
  getReportTempalteVersion: (id) =>
    doGet('/app/report/templates/' + id + '/version', {}),
  getTreeList: (id) =>
    doGet('/app/report/templates/findDirectoryByRootId/' + id, {}),
  exportReportByProjectId: (id) => {
    return '/app/reports/generate/export/' + id;
  },
  saveReport: (id, params) => doPut('/app/reports/generate/' + id, params),
  getReportConclusion: (id) =>
    doGet('/app/reports/generate/conclusion/' + id, {}),
  getReportFieldList: (id) => doGet('/app/reports/generate/fields/' + id, {}),
  getReportContent: (id) => doGet('/app/reports/generate/' + id),
  //查询未启用的字段
  getUnusedFields: (params) =>
    doGet('app/report/templates/' + params + '/fields/unused'),
  //获取所有的字段树
  getFileds: (params) => doGet('/app/report/templates/' + params + '/fields'),
  getReporTemplateById: (id) => doGet('/app/report/templates/' + id, {}),
  auditTemplate: (identifier, id, params) =>
    doPut(`/app/report/templates/${identifier}/${id}/submit`, params),
  rejectTemplate: (identifier, id) => doPut(`/app/report/templates/${identifier}/${id}/reject`, {}),
  publishReportTempalte: (identifier, id, params) => doPut(`/app/report/templates/${identifier}/${id}/audit`, params),
  deleteReportTemplate: (identifier, id) => doDelete(`/app/report/templates/${identifier}/`, id),
  updateReportTemplateDetail: (identifier, id, params) => doPut(`/app/report/templates/${identifier}/${id}/save`, params),
  createReportTemplate: (params) => doPost('/app/report/templates', params),
  disableOrEnableTemplate: (identifier, id, status, params) =>
    doPut(`/app/report/templates/${identifier}/${id}/${status}`, params),
  getReportTemplateConfigs: (params) => doGet(`/app/reports/reportTemplateConfigs`, params),
  putReportTemplateConfigs: (params) => doPut(`/app/reports/reportTemplateConfigs`, params),
  getReportVersions: (params) => doGet('/app/reports/versions', params),
  getReportLogs: (identifier, params) => doGet(`/app/report/templates/${identifier}/logs`, params),
  getRelationList: (params) => doGet(`/app/templates/versions`, params),
  saveRelation: (id, params) => doPut(`/app/templates/versions/${id}/connection`, params),
  getReportList: (params) => doGet(`/app/report/templates/versions`, params)
};
export default reportService;
