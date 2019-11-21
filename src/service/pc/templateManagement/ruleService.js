import { doGet, doPost, doPut, doDelete } from "../../../axiosconfig/index.js";
let ruleService = {
  getRuleList: params => doGet("/app/rules", params),
  getRuleById: id => doGet(`/app/rules/singleRule/${id}`, {}),
  create: params => doPost("/app/rules/pageDisplayRule", params),
  update: (id, params) => doPut(`/app/rules/pageDisplayRule/${id}`, params),
  delete: id => doDelete(`/app/rules/${id}`),
  copy: id => doPut(`/app/rules/copy/${id}`),
  getLinkList: params => doGet(`/app/shareComponent/findListByEnum`, params),
  createFormulaRule: params => doPost(`/app/rules/dataFormulaRule`, params),
  updateFormulaRule: (id, params) => doPut(`/app/rules/changeDataFormulaRule/${id}`, params),
  createDataValidationRule: params => doPost(`/app/rules/dataValidationRule`, params),
  updateDataValidationRule: (id, params) => doPut(`/app/rules/dataValidationRule/${id}`, params),
  createDataLinkageChangeRule: params => doPost(`/app/rules/dataLinkageChangeRule`, params),
  updateDataLinkageChangeRule: (id, params) => doPut(`/app/rules/dataLinkageChangeRule/${id}`, params),
  getTemplateChoiceItems: (templateId, componentId) => doGet(`/app/templates/choiceItems/${templateId}/${componentId}`, {}),
  getTemplateCompen: (temId, comId) => doGet(`/app/templates/${temId}/${comId}/component`, {}),
  getTemplateCompent: identifier => doGet(`/app/templates/${identifier}/components`, {}),
  getComponents: (templateId, params) => doGet(`/app/templates/${templateId}/allWidgetsOrSubWidgets`, params),
  getComponentsWithChild: (id, componentId) => doGet(`/app/templates/${id}/${componentId}/allWidgets`, {}),
  getComponentsIsCustomerNumber: (id, componentId) => doGet(`/app/templates/${id}/${componentId}/customNumber/widgets`, {}),
  getRuleByType: (id, type) => doGet(`/app/rules/${id}/${type}`, {}),
  //添加录入数据规则
  addDataInputRule: params => doPost("/app/rules/dataInputRule", params),
  getRuleSortList: id => doGet(`/app/templates/${id}/rules`, {}),
  saveRuleSortList: (id, params) => doPut(`/app/templates/${id}/rules/sort`, params),
  saveViewRuleSortList: (params) => doPut(`/app/rules/rules/sort`, params),
  //修改录入数据规则
  editDataInputRule: (id, params) => doPut(`/app/rules/dataInputRule/${id}`, params),
  createConectDataRule: params => doPost("/app/rules/dataConnectionRule", params),
  updateConectDataRule: (id, params) => doPut(`/app/rules/dataConnectionRule/${id}`, params),
  createDataChangeRule: params => doPost(`/app/rules/dataChangeRule`, params),
  updateDataChangeRule: (id, params) => doPut(`/app/rules/dataChangeRule/${id}`, params),
  createDataBatchAdaptationRule: params => doPost("/app/rules/dataBatchAdaptationRule", params),
  updateDataBatchAdaptationRule: (id, params) => doPut(`/app/rules/dataBatchAdaptationRule/${id}`, params),
  // 获取数据联动规则执行结果
  findDataLinkageChangeRuleResult: (params) => doPost(`/app/rules/findDataLinkageChangeRuleResult`, params),
  // 获取函数列表
  getFormulaFuntions: () => doGet(`/app/formula/functions`)
};
export default ruleService;
